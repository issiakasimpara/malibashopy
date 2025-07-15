
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ArrowRight, Plus, Calendar, User, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useOrders } from "@/hooks/useOrders";

const RecentOrders = () => {
  const { orders, isLoading } = useOrders();

  // Prendre les 5 dernières commandes
  const recentOrders = orders.slice(0, 5);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmée', color: 'bg-blue-100 text-blue-800' },
      processing: { label: 'En traitement', color: 'bg-purple-100 text-purple-800' },
      shipped: { label: 'Expédiée', color: 'bg-orange-100 text-orange-800' },
      delivered: { label: 'Livrée', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <Badge className={`${config.color} border-0 text-xs`}>
        {config.label}
      </Badge>
    );
  };
  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-background via-background to-muted/20 backdrop-blur-sm overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      
      <CardHeader className="flex flex-row items-center justify-between pb-6 bg-gradient-to-r from-blue-50/30 via-purple-50/30 to-pink-50/30 dark:from-blue-950/10 dark:via-purple-950/10 dark:to-pink-950/10">
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Commandes récentes
          </CardTitle>
          <CardDescription className="text-base font-medium">Vos dernières ventes</CardDescription>
        </div>
        <Button variant="outline" size="default" asChild className="group hover:bg-blue-50 dark:hover:bg-blue-950/30 border-2 hover:border-blue-500/50 transition-all duration-300">
          <Link to="/orders">
            Voir tout
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-center py-12">
          <div className="relative mx-auto mb-6 w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center shadow-lg">
            <ShoppingCart className="h-12 w-12 text-gray-400" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
          </div>
          <p className="text-lg text-muted-foreground mb-6 font-medium">Aucune commande pour le moment</p>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Link to="/products">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter des produits
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
