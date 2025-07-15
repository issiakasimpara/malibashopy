
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const RevenueChart = () => {
  const chartConfig = {
    revenue: {
      label: "Chiffre d'affaires",
      color: "#8b5cf6",
    },
    profit: {
      label: "Bénéfice",
      color: "#06b6d4",
    },
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Revenus cette semaine</CardTitle>
        <CardDescription>
          Chiffre d'affaires et bénéfices par jour
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <p className="text-sm">Aucune donnée de revenus disponible</p>
                <p className="text-xs mt-1">Les données apparaîtront ici une fois que vous aurez des revenus</p>
              </div>
            </div>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
