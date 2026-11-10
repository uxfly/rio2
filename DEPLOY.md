# Deploy — Rio Lançamentos v2 (VPS, Node/standalone)

Site rodando como **processo Node** (`next start` via bundle *standalone*) na **porta 4321**,
atrás do proxy reverso do nginx. Deploy manual com **release atômico** e **rollback** por symlink.

```
/home/riolancamentos/htdocs/riolancamentos.com.br/
├── releases/
│   ├── v2-20260730xxxxxx/   ← cada deploy vira um release novo
│   └── v2-20260730yyyyyy/
└── current -> releases/v2-...   ← symlink que o PM2/nginx usam
```

---

## 0. Segurança primeiro (faça agora)

Você colou a senha de **root** no chat — considere-a **comprometida**.

1. **Troque a senha do root** (logado no servidor): `passwd`
2. **Crie/rotacione uma chave SSH** na sua máquina (se ainda não tem):
   ```bash
   ssh-keygen -t ed25519 -C "deploy-rio"
   ```
3. **Autorize a chave** para um usuário **não-root** de deploy (recomendo o próprio `riolancamentos`):
   ```bash
   ssh-copy-id riolancamentos@82.25.64.214
   ```
4. Depois de confirmar que o login por chave funciona, **desative login por senha** no SSH
   (`/etc/ssh/sshd_config`: `PasswordAuthentication no` e `PermitRootLogin no`, então `systemctl reload ssh`).

O `deploy.sh` usa o usuário **não-root** por chave — nunca a senha.

---

## 1. Preparar o servidor (uma vez)

Como o usuário de deploy:

```bash
# Node 22 (via nvm ou nodesource) + PM2
node -v            # confirme 22.x
npm i -g pm2

# estrutura de releases
mkdir -p /home/riolancamentos/htdocs/riolancamentos.com.br/releases

# PM2 sobe sozinho no boot
pm2 startup    # rode o comando que ele imprimir
```

### nginx (proxy reverso → :4321)
A v1 já roda na 4321, então o proxy provavelmente já existe. Confirme algo como:

```nginx
location / {
    proxy_pass http://127.0.0.1:4321;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

> ⚠ **Conflito de porta com a v1:** só um processo pode ocupar a :4321.
> O `deploy.sh` faz `pm2 delete` + `pm2 start` com o nome `riolancamentos` — se a v1
> roda com **outro** nome de processo, pare a v1 antes do primeiro deploy da v2:
> `pm2 stop <nome-da-v1>`. A v1 continua em disco (em `releases/` ou onde estiver)
> para rollback; só não pode disputar a porta.

---

## 2. Deploy

Na sua máquina, na raiz do projeto:

```bash
./deploy.sh
```

O que ele faz: build local (`standalone`) → empacota `.next/standalone` + `.next/static` + `public`
→ `rsync` para `releases/v2-<timestamp>` → aponta `current` → `pm2 start` na :4321 → poda releases antigos (mantém 5).

Simular sem enviar:
```bash
DRY_RUN=1 ./deploy.sh
```

Overrides (opcionais): `DEPLOY_HOST`, `DEPLOY_BASE`, `DEPLOY_PORT`, `DEPLOY_PM2_NAME`, `DEPLOY_SITE_URL`, `DEPLOY_KEEP`.

---

## 3. Rollback (segundos, sem downtime real)

```bash
ssh riolancamentos@82.25.64.214
ls -1t /home/riolancamentos/htdocs/riolancamentos.com.br/releases   # ver releases
cd /home/riolancamentos/htdocs/riolancamentos.com.br
ln -sfn releases/<release-anterior> current
cd current && pm2 delete riolancamentos; PORT=4321 HOSTNAME=127.0.0.1 pm2 start server.js --name riolancamentos
```

---

## 4. Migrar a v1 (só depois da v2 provada)

A v1 **não é apagada no deploy**. Quando a v2 estiver validada em produção por alguns dias,
aí sim você remove a v1 manualmente (backup você já tem). Enquanto isso ela é sua rede de segurança.

## Notas
- **Zero-downtime real** (sem o blip do restart) exigiria 2 portas + upstream no nginx. Para um site
  institucional o restart do PM2 (~1s) é aceitável; dá pra evoluir depois.
- **CI/CD futuro:** dá pra portar esse mesmo fluxo para GitHub Actions (rsync por SSH com chave nos
  Secrets) quando quiser deploy automático no push.
