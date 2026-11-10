#!/usr/bin/env bash
#
# Deploy da v2 (Next em modo Node/standalone) para o VPS.
# Build LOCAL -> empacota .next/standalone -> rsync via SSH -> release atômico
# (symlink `current`) -> (re)start do processo Node na porta 4321 via PM2.
#
# Rollback = repontar o symlink `current` para o release anterior e reload.
#
# PRÉ-REQUISITOS (uma vez só — ver DEPLOY.md):
#   - Autenticação por CHAVE SSH (nada de senha; troque a senha de root antes).
#   - Usuário NÃO-root de deploy no servidor (ex.: riolancamentos).
#   - Node 22 + PM2 instalados no servidor.
#
# Uso:
#   ./deploy.sh            # deploy normal
#   DRY_RUN=1 ./deploy.sh  # simula o rsync sem enviar
#
set -euo pipefail

# ----------------------------- config -----------------------------
# Deploy como root (você sabe a senha do root). Funciona; o ideal a médio prazo
# é um usuário não-root do site — mas então rode o PM2 também como root p/ ele
# conseguir ler os arquivos (que ficarão root:root). Override: DEPLOY_HOST=...
SSH_HOST="${DEPLOY_HOST:-root@82.25.64.214}"
REMOTE_BASE="${DEPLOY_BASE:-/home/riolancamentos/htdocs/riolancamentos.com.br}"
APP_PORT="${DEPLOY_PORT:-4321}"
PM2_NAME="${DEPLOY_PM2_NAME:-riolancamentos}"
SITE_URL="${DEPLOY_SITE_URL:-https://riolancamentos.com.br}"
KEEP_RELEASES="${DEPLOY_KEEP:-5}"
STORAGE_DIR="${DEPLOY_STORAGE_DIR:-/var/lib/rio}"
SSH_IDENTITY="${DEPLOY_IDENTITY:-}"
SEED_DATABASE="${DEPLOY_SEED_DATABASE:-0}"
# ------------------------------------------------------------------

SSH_ARGS=""
if [ -n "$SSH_IDENTITY" ]; then
  SSH_ARGS="-i $SSH_IDENTITY -o IdentitiesOnly=yes"
fi

RSYNC_SSH="ssh $SSH_ARGS"

RELEASE="v2-$(date +%Y%m%d%H%M%S)"
REMOTE_RELEASES="$REMOTE_BASE/releases"
REMOTE_DIR="$REMOTE_RELEASES/$RELEASE"
RSYNC_FLAGS=(-az --delete)
[ "${DRY_RUN:-0}" = "1" ] && RSYNC_FLAGS+=(--dry-run) && echo "⚠  DRY_RUN — nada será enviado de fato"

cd "$(dirname "$0")"

echo "▶ 1/4  Build local (standalone)..."
rm -rf .next
NEXT_PUBLIC_SITE_URL="$SITE_URL" npm run build

if [ ! -f .next/standalone/server.js ]; then
  echo "✗ .next/standalone/server.js não gerado. Confirme que next.config tem output: 'standalone'." >&2
  exit 1
fi

echo "▶ 2/4  Empacotando bundle..."
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT
cp -R .next/standalone/. "$STAGE/"          # server.js + node_modules mínimo + package.json
mkdir -p "$STAGE/.next"
cp -R .next/static "$STAGE/.next/static"     # assets estáticos (não vêm no standalone)
[ -d public ] && cp -R public "$STAGE/public"

# O tracing do standalone mantém apenas o binário nativo da plataforma do
# build local. Como o build acontece no macOS e a VPS é Linux x64, inclui
# explicitamente o prebuild correto que já vem no pacote better-sqlite3.
if [ -f node_modules/better-sqlite3/prebuilds/linux-x64.node ]; then
  mkdir -p "$STAGE/node_modules/better-sqlite3/prebuilds"
  cp node_modules/better-sqlite3/prebuilds/linux-x64.node \
    "$STAGE/node_modules/better-sqlite3/prebuilds/linux-x64.node"
fi

# O banco nunca pertence ao release. No primeiro deploy da versão dinâmica,
# envia uma cópia consistente apenas para inicializar o diretório persistente.
if [ "$SEED_DATABASE" = "1" ] && [ -f .data/rio.sqlite ]; then
  mkdir -p "$STAGE/.seed"
  sqlite3 .data/rio.sqlite ".backup '$STAGE/.seed/rio.sqlite'"
  [ -d .data/media ] && cp -R .data/media "$STAGE/.seed/media"
fi

echo "▶ 3/4  Enviando release $RELEASE..."
ssh $SSH_ARGS "$SSH_HOST" "mkdir -p '$REMOTE_DIR'"
rsync -e "$RSYNC_SSH" "${RSYNC_FLAGS[@]}" "$STAGE/" "$SSH_HOST:$REMOTE_DIR/"

if [ "${DRY_RUN:-0}" = "1" ]; then
  ssh $SSH_ARGS "$SSH_HOST" "rm -rf '$REMOTE_DIR'"
  echo "✓ DRY_RUN concluído (release de teste removido)."
  exit 0
fi

echo "▶ 4/4  Troca atômica + (re)start na porta $APP_PORT..."
ssh $SSH_ARGS "$SSH_HOST" bash -s <<REMOTE
  set -euo pipefail
  mkdir -p "$STORAGE_DIR"
  if [ ! -f "$STORAGE_DIR/rio.sqlite" ] && [ -f "$REMOTE_DIR/.seed/rio.sqlite" ]; then
    install -m 600 "$REMOTE_DIR/.seed/rio.sqlite" "$STORAGE_DIR/rio.sqlite"
    if [ -d "$REMOTE_DIR/.seed/media" ]; then
      mkdir -p "$STORAGE_DIR/media"
      cp -a "$REMOTE_DIR/.seed/media/." "$STORAGE_DIR/media/"
    fi
  fi
  rm -rf "$REMOTE_DIR/.seed"

  # release atômico: aponta 'current' para o novo release
  ln -sfn "$REMOTE_DIR" "$REMOTE_BASE/current"

  # (re)start do Node na :$APP_PORT via PM2 a partir do symlink resolvido
  cd "$REMOTE_BASE/current"
  pm2 delete "$PM2_NAME" >/dev/null 2>&1 || true
  PORT=$APP_PORT HOSTNAME=127.0.0.1 RIO_STORAGE_DIR="$STORAGE_DIR" pm2 start server.js --name "$PM2_NAME" --cwd "$REMOTE_BASE/current"
  pm2 save >/dev/null

  # mantém só os $KEEP_RELEASES releases mais recentes
  ls -1dt "$REMOTE_RELEASES"/*/ 2>/dev/null | tail -n +$((KEEP_RELEASES + 1)) | xargs -r rm -rf
REMOTE

echo
echo "✅ Deploy $RELEASE no ar → $SITE_URL  (Node :$APP_PORT)"
echo "   Releases:  ssh $SSH_HOST 'ls -1t $REMOTE_RELEASES'"
echo "   Rollback:  ssh $SSH_HOST 'ln -sfn $REMOTE_RELEASES/<anterior> $REMOTE_BASE/current && cd $REMOTE_BASE/current && pm2 delete $PM2_NAME; PORT=$APP_PORT HOSTNAME=127.0.0.1 pm2 start server.js --name $PM2_NAME'"
