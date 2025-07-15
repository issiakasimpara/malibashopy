
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";

const DashboardStats = () => {
  const stats = [
    {
      title: "Chiffre d'affaires",
      value: "0 CFA",
      change: "Aucune vente",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30",
      iconBg: "from-emerald-500 to-green-500",
      borderColor: "border-emerald-200/50 dark:border-emerald-800/50"
    },
    {
      title: "Commandes",
      value: "0",
      change: "Aucune commande",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
      iconBg: "from-blue-500 to-cyan-500",
      borderColor: "border-blue-200/50 dark:border-blue-800/50"
    },
    {
      title: "Produits",
      value: "0",
      change: "Aucun produit",
      icon: Package,
      color: "text-purple-600",
      bgColor: "from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30",
      iconBg: "from-purple-500 to-violet-500",
      borderColor: "border-purple-200/50 dark:border-purple-800/50"
    },
    {
      title: "Visiteurs",
      value: "0",
      change: "Aucun visiteur",
      icon: Users,
      color: "text-orange-600",
      bgColor: "from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30",
      iconBg: "from-orange-500 to-amber-500",
      borderColor: "border-orange-200/50 dark:border-orange-800/50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className={`group relative overflow-hidden border-2 ${stat.borderColor} shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-1`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-60`} />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className={`text-sm font-bold ${stat.color} uppercase tracking-wider`}>
              {stat.title}
            </CardTitle>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.iconBg} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
              <stat.icon className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-foreground mb-2 group-hover:scale-105 transition-transform duration-300">{stat.value}</div>
            <p className="text-sm text-muted-foreground font-medium">
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
