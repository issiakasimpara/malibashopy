
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Clock, ShoppingBag, CreditCard } from "lucide-react";

const PerformanceMetrics = () => {
  const metrics = [
    {
      title: "Taux de conversion",
      value: "0%",
      target: "4.0%",
      progress: 0,
      icon: Target
    },
    {
      title: "Temps moyen sur site",
      value: "0m 0s",
      target: "3m 00s",
      progress: 0,
      icon: Clock
    },
    {
      title: "Panier abandonné",
      value: "0%",
      target: "60.0%",
      progress: 0,
      icon: ShoppingBag
    },
    {
      title: "Paiements réussis",
      value: "0%",
      target: "95.0%",
      progress: 0,
      icon: CreditCard
    }
  ];

  const salesTargets = [
    { period: "Aujourd'hui", target: 0, achieved: 0, percentage: 0 },
    { period: "Cette semaine", target: 0, achieved: 0, percentage: 0 },
    { period: "Ce mois", target: 0, achieved: 0, percentage: 0 },
    { period: "Cette année", target: 0, achieved: 0, percentage: 0 }
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Performance Metrics */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Métriques de performance</CardTitle>
          <CardDescription>
            Indicateurs clés de performance de votre boutique
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gray-50">
                    <metric.icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{metric.title}</p>
                    <p className="text-sm text-gray-500">Objectif: {metric.target}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{metric.value}</p>
                  <p className="text-xs text-gray-500">Aucune donnée</p>
                </div>
              </div>
              <Progress value={metric.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sales Targets */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Objectifs de ventes</CardTitle>
          <CardDescription>
            Suivi de vos objectifs par période
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {salesTargets.map((target, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{target.period}</span>
                <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                  {target.percentage}%
                </Badge>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{target.achieved.toLocaleString()} CFA</span>
                <span>/ {target.target.toLocaleString()} CFA</span>
              </div>
              <Progress value={target.percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMetrics;
