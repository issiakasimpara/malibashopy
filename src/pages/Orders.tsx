import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Package, Calendar, Eye, Edit, Loader2, RefreshCw } from 'lucide-react';
import { useStores } from '@/hooks/useStores';
import { useOrders } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';
import { Order } from '@/services/orderService';

const Orders = () => {
  const { store } = useStores();
  const { toast } = useToast();
  const {
    orders,
    isLoading,
    updateOrderStatus,
    updatePaymentStatus,
    isUpdatingStatus,
    isUpdatingPayment,
    refetchOrders
  } = useOrders();

  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const filterOrders = () => {
    let results = [...orders];

    if (searchTerm) {
      results = results.filter(order =>
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customer_name && order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.customer_phone && order.customer_phone.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      results = results.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(results);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' },
      confirmed: { label: 'Confirmée', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' },
      processing: { label: 'En traitement', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300' },
      shipped: { label: 'Expédiée', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300' },
      delivered: { label: 'Livrée', className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' },
      cancelled: { label: 'Annulée', className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus({ orderId, status: newStatus });
  };

  const handlePaymentStatusChange = (orderId: string, newStatus: Order['payment_status']) => {
    updatePaymentStatus({ orderId, status: newStatus });
  };

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
      <Badge className={`${config.color} border-0 mb-2`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Gestion des commandes
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Visualisez et gérez les commandes de votre boutique ({orders.length} commande{orders.length !== 1 ? 's' : ''})
            </p>
          </div>
          <Button
            onClick={() => refetchOrders()}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  type="text"
                  placeholder="Rechercher une commande..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Select onValueChange={handleStatusFilterChange}>
                  <SelectTrigger className="w-full bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="confirmed">Confirmée</SelectItem>
                    <SelectItem value="processing">En traitement</SelectItem>
                    <SelectItem value="shipped">Expédiée</SelectItem>
                    <SelectItem value="delivered">Livrée</SelectItem>
                    <SelectItem value="cancelled">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement des commandes...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card className="shadow-lg border-0">
            <CardContent className="text-center py-16">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-2xl w-fit mx-auto mb-6">
                <Package className="h-12 w-12 mx-auto text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Aucune commande trouvée
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg max-w-md mx-auto">
                Il n'y a aucune commande correspondant à vos critères de recherche.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(order => (
              <Card key={order.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        Commande #{order.order_number}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        <Calendar className="inline-block h-4 w-4 mr-1" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Client: {order.customer_name || order.customer_email}
                      </p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order.status)}
                      <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
                        {Number(order.total_amount).toLocaleString()} {order.currency}
                      </p>
                      <p className="text-sm text-gray-500">
                        Paiement: {order.payment_status === 'paid' ? '✅ Payé' : '⏳ En attente'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Voir
                    </Button>
                    <Button>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
