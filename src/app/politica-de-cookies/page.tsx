import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Política de Cookies | Rio Lançamentos",
  description: "Informações sobre o uso de cookies no Rio Lançamentos.",
};

export default function Page() {
  return (
    <LegalPage
      eyebrow="Preferências de navegação"
      title="Política de Cookies"
      updated="27 de julho de 2026"
      introduction="Esta política descreve como tecnologias de armazenamento local poderão apoiar o funcionamento, a medição e a personalização do portal."
      sections={[
        {
          title: "O que são cookies",
          paragraphs: [
            "Cookies são pequenos arquivos ou identificadores armazenados no dispositivo durante a navegação. Eles podem manter preferências, apoiar funções essenciais e gerar informações agregadas sobre o uso do site.",
          ],
        },
        {
          title: "Categorias",
          paragraphs: [
            "Cookies necessários viabilizam recursos fundamentais. Cookies de desempenho ajudam a compreender a navegação. Cookies de personalização podem guardar escolhas, e cookies de marketing somente devem ser utilizados quando houver fundamento adequado.",
          ],
        },
        {
          title: "Controle do usuário",
          paragraphs: [
            "Quando recursos não essenciais forem ativados, o usuário deverá receber informações claras e meios para gerenciar suas preferências. Também é possível ajustar permissões diretamente no navegador.",
          ],
        },
        {
          title: "Atualizações",
          paragraphs: [
            "Esta política poderá ser atualizada para refletir mudanças técnicas ou regulatórias. A versão vigente será identificada pela data exibida nesta página.",
          ],
        },
      ]}
    />
  );
}
