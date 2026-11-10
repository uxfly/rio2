import { Building2Icon, EyeIcon, MessageSquareTextIcon, TrendingUpIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SectionCards({ propertyCount = 0 }: { propertyCount?: number }) {
  const metrics = [
    { label: "Imóveis publicados", value: String(propertyCount), note: "Catálogo ativo", icon: Building2Icon },
    { label: "Leads no mês", value: "28", note: "+12% sobre o mês anterior", icon: TrendingUpIcon },
    { label: "Mensagens pendentes", value: "7", note: "Aguardando atendimento", icon: MessageSquareTextIcon },
    { label: "Visualizações", value: "4.820", note: "Últimos 30 dias", icon: EyeIcon },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:px-6 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.label} className="bg-gradient-to-br from-card to-muted/35 shadow-lg shadow-black/10">
            <CardHeader className="grid grid-cols-[1fr_auto] items-start">
              <div>
                <CardDescription>{metric.label}</CardDescription>
                <CardTitle className="mt-2 text-3xl font-semibold tabular-nums">{metric.value}</CardTitle>
              </div>
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Icon className="size-4" /></span>
            </CardHeader>
            <CardContent><p className="text-xs text-muted-foreground">{metric.note}</p></CardContent>
          </Card>
        );
      })}
    </div>
  );
}
