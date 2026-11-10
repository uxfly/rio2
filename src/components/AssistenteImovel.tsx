"use client";

import { FormEvent, useState } from "react";
import type { ImovelDetalhe } from "@/lib/imoveis";
import styles from "./AssistenteImovel.module.css";

type Mensagem = {
  origem: "assistente" | "usuario";
  texto: string;
};

type AssistenteImovelProps = {
  imovel: ImovelDetalhe;
};

const SUGESTOES = [
  "Quero agendar uma visita",
  "Condições de pagamento",
  "Fale sobre a localização",
] as const;

export default function AssistenteImovel({
  imovel,
}: AssistenteImovelProps) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      origem: "assistente",
      texto: `Olá. Posso ajudar você a entender o ${imovel.nome}, comparar opções ou organizar uma visita.`,
    },
  ]);
  const [texto, setTexto] = useState("");

  function respostaPara(pergunta: string) {
    const normalizada = pergunta.toLowerCase();
    if (normalizada.includes("visita") || normalizada.includes("conhecer")) {
      return "Perfeito. Posso organizar uma visita privada e sugerir os melhores horários de luz no imóvel. Deixe seu contato e a curadoria confirma a disponibilidade.";
    }
    if (
      normalizada.includes("pagamento") ||
      normalizada.includes("valor") ||
      normalizada.includes("preço")
    ) {
      return `O valor apresentado é ${imovel.valor}. Tabela, disponibilidade e condições são confirmadas pela curadoria antes de qualquer decisão.`;
    }
    if (
      normalizada.includes("local") ||
      normalizada.includes("bairro") ||
      normalizada.includes("mapa")
    ) {
      return `${imovel.nome} fica em ${imovel.endereco}. Posso também comparar mobilidade, serviços e estilo de vida com outros endereços próximos.`;
    }
    if (
      normalizada.includes("planta") ||
      normalizada.includes("área") ||
      normalizada.includes("suite")
    ) {
      return `A tipologia informada é ${imovel.tipologia}, com ${imovel.area}. Posso solicitar plantas e o material técnico completo para você.`;
    }
    return "Entendi. Vou organizar essa pergunta para a curadoria responder com contexto, disponibilidade atual e os documentos corretos do imóvel.";
  }

  function enviar(pergunta: string) {
    const limpa = pergunta.trim();
    if (!limpa) return;
    setMensagens((atuais) => [
      ...atuais,
      { origem: "usuario", texto: limpa },
      { origem: "assistente", texto: respostaPara(limpa) },
    ]);
    setTexto("");
  }

  function aoEnviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    enviar(texto);
  }

  return (
    <aside className={styles.panel} aria-label="Assistente inteligente do imóvel">
      <div className={styles.heading}>
        <div>
          <span className={styles.status} aria-hidden="true" />
          Fale Comigo
        </div>
        <span>Atendimento inteligente</span>
      </div>

      <div className={styles.price}>
        <span>Valor do imóvel</span>
        <strong>{imovel.valor}</strong>
        <p>Informações demonstrativas. Confirmação pela curadoria.</p>
      </div>

      <div className={styles.messages} aria-live="polite">
        {mensagens.slice(-4).map((mensagem, index) => (
          <p
            className={
              mensagem.origem === "usuario"
                ? styles.userMessage
                : styles.assistantMessage
            }
            key={`${mensagem.origem}-${index}`}
          >
            {mensagem.texto}
          </p>
        ))}
      </div>

      <div className={styles.suggestions}>
        {SUGESTOES.map((sugestao) => (
          <button type="button" onClick={() => enviar(sugestao)} key={sugestao}>
            {sugestao}
          </button>
        ))}
      </div>

      <form onSubmit={aoEnviar}>
        <label htmlFor="pergunta-imovel">O que você deseja saber?</label>
        <div>
          <input
            id="pergunta-imovel"
            value={texto}
            onChange={(event) => setTexto(event.target.value)}
            placeholder="Digite sua pergunta"
            autoComplete="off"
          />
          <button type="submit" aria-label="Enviar pergunta">
            →
          </button>
        </div>
      </form>

    </aside>
  );
}
