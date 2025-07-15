
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const SalesChart = () => {
  const chartConfig = {
    sales: {
      label: "Ventes (CFA)",
      color: "#3b82f6",
    },
    orders: {
      label: "Commandes",
      color: "#10b981",
    },
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Évolution des ventes</CardTitle>
        <CardDescription>
          Suivi mensuel du chiffre d'affaires et des commandes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <p className="text-sm">Aucune donnée de vente disponible</p>
                <p className="text-xs mt-1">Les données apparaîtront ici une fois que vous aurez des ventes</p>
              </div>
            </div>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
