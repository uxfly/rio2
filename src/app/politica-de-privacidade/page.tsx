import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Política de Privacidade | Rio Lançamentos",
  description:
    "Informações sobre privacidade e tratamento de dados no Rio Lançamentos.",
};

export default function Page() {
  return (
    <LegalPage
      eyebrow="Privacidade e dados"
      title="Política de Privacidade"
      updated="27 de julho de 2026"
      introduction="Este aviso explica, de forma clara, como dados fornecidos ao Rio Lançamentos podem ser utilizados nos formulários e canais de atendimento."
      sections={[
        {
          title: "Dados fornecidos pelo usuário",
          paragraphs: [
            "Podemos receber nome, e-mail, telefone, preferências imobiliárias e informações incluídas voluntariamente em formulários de contato, newsletter ou atendimento.",
          ],
        },
        {
          title: "Finalidades",
          paragraphs: [
            "Os dados podem ser utilizados para responder solicitações, apresentar imóveis compatíveis com o interesse informado, enviar comunicações autorizadas e aprimorar a experiência do portal.",
            "Comunicações baseadas em consentimento poderão ser canceladas pelo titular a qualquer momento.",
          ],
        },
        {
          title: "Proteção e compartilhamento",
          paragraphs: [
            "Adotamos medidas razoáveis de segurança e limitamos o acesso às informações. Dados poderão ser processados por fornecedores necessários ao atendimento e à operação do portal, observadas as finalidades informadas.",
          ],
        },
        {
          title: "Direitos do titular",
          paragraphs: [
            "Nos termos da LGPD, o titular pode solicitar confirmação de tratamento, acesso, correção, informações sobre compartilhamento, revogação do consentimento e eliminação quando aplicável.",
            "Solicitações podem ser feitas pelos canais da página de contato e serão analisadas conforme a legislação aplicável.",
          ],
        },
      ]}
    />
  );
}
