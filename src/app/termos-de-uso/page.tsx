import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Termos de Uso | Rio Lançamentos",
  description: "Termos de uso do portal Rio Lançamentos.",
};

export default function Page() {
  return (
    <LegalPage
      eyebrow="Informações legais"
      title="Termos de Uso"
      updated="27 de julho de 2026"
      introduction="Estes termos apresentam as condições gerais para navegar e utilizar os conteúdos e recursos do portal Rio Lançamentos."
      sections={[
        {
          title: "Natureza do conteúdo",
          paragraphs: [
            "O portal reúne conteúdo editorial, informações imobiliárias e recursos de contato. Imagens, valores, disponibilidades e características de produtos podem ser demonstrativos e devem ser confirmados com a equipe responsável antes de qualquer decisão.",
          ],
        },
        {
          title: "Uso do portal",
          paragraphs: [
            "O usuário se compromete a utilizar o site de forma lícita, sem tentar comprometer sua segurança, disponibilidade ou integridade.",
            "Conteúdos, marcas, textos, interfaces e elementos visuais não podem ser reproduzidos comercialmente sem autorização.",
          ],
        },
        {
          title: "Informações imobiliárias",
          paragraphs: [
            "A apresentação de um imóvel não constitui proposta definitiva. Condições comerciais, registros, incorporações, disponibilidade e demais informações relevantes dependem de validação documental e comercial.",
          ],
        },
        {
          title: "Contato",
          paragraphs: [
            "Dúvidas sobre estes termos podem ser encaminhadas pelos canais disponíveis na página de contato do portal.",
          ],
        },
      ]}
    />
  );
}
