
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { Trash2, CreditCard, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useOrders } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';

const Checkout = () => {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { storeSlug } = useParams();
  const { createOrder, isCreating } = useOrders();
  const { toast } = useToast();

  // Détecter si nous sommes dans l'aperçu
  const isInPreview = window.self !== window.top;
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCustomerInfoChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckout = async () => {
    // Validation des champs requis
    if (!customerInfo.email || !customerInfo.firstName || !customerInfo.lastName || !customerInfo.address) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Panier vide",
        description: "Ajoutez des produits avant de passer commande.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      console.log('🛒 Début du processus de commande...');

      // Si nous sommes en mode aperçu, simuler la commande
      if (isInPreview) {
        console.log('📱 Mode aperçu - simulation de commande');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simuler le traitement
        const successUrl = '/payment-success?preview=true';
        navigate(successUrl);
        return;
      }

      // Récupérer les informations de la boutique depuis l'URL ou le contexte
      const storeInfo = await getStoreInfo();
      if (!storeInfo) {
        throw new Error('Impossible de récupérer les informations de la boutique');
      }

      // Préparer les données de commande
      const orderData = {
        storeId: storeInfo.id,
        storeName: storeInfo.name,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          product_id: item.product_id
        })),
        customerInfo,
        paymentMethod,
        totalAmount: getTotalPrice(),
        currency: 'CFA',
        shippingCost: 0
      };

      console.log('📝 Création de la commande:', orderData);

      // Créer la commande
      createOrder(orderData, {
        onSuccess: (order) => {
          console.log('✅ Commande créée:', order);

          // Vider le panier
          clearCart();

          // Rediriger vers la page de succès avec le numéro de commande
          navigate(`/payment-success?order=${order.order_number}`);
        },
        onError: (error) => {
          console.error('❌ Erreur création commande:', error);
          throw error;
        }
      });

    } catch (error: any) {
      console.error('❌ Erreur checkout:', error);
      toast({
        title: "Erreur de commande",
        description: error.message || "Une erreur est survenue lors de la commande.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Fonction pour récupérer les infos de la boutique
  const getStoreInfo = async () => {
    try {
      // Si nous avons le slug dans l'URL, l'utiliser
      if (storeSlug) {
        // Ici on pourrait faire un appel API pour récupérer les infos de la boutique
        // Pour l'instant, on simule avec des données de base
        return {
          id: 'store-from-slug',
          name: storeSlug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
        };
      }

      // Sinon, essayer de récupérer depuis le localStorage ou le contexte
      const storeData = localStorage.getItem('currentStore');
      if (storeData) {
        return JSON.parse(storeData);
      }

      // Fallback: utiliser une boutique par défaut
      return {
        id: 'default-store',
        name: 'Ma Boutique'
      };
    } catch (error) {
      console.error('❌ Erreur récupération boutique:', error);
      return null;
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">Votre panier est vide</h3>
              <p className="text-gray-600 mb-6">Ajoutez des produits avant de procéder au paiement</p>
              <Button onClick={() => navigate('/')}>
                Retour à la boutique
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Finaliser votre commande</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Informations client */}
          <Card>
            <CardHeader>
              <CardTitle>Informations de livraison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={customerInfo.firstName}
                    onChange={(e) => handleCustomerInfoChange('firstName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={customerInfo.lastName}
                    onChange={(e) => handleCustomerInfoChange('lastName', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                  placeholder="+221 XX XXX XX XX"
                />
              </div>

              <div>
                <Label htmlFor="address">Adresse *</Label>
                <Input
                  id="address"
                  value={customerInfo.address}
                  onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={customerInfo.city}
                    onChange={(e) => handleCustomerInfoChange('city', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    id="postalCode"
                    value={customerInfo.postalCode}
                    onChange={(e) => handleCustomerInfoChange('postalCode', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Récapitulatif de commande */}
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif de commande</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      )}
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-gray-600">{item.price} CFA</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.variant_id)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.variant_id)}
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.product_id, item.variant_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>{getTotalPrice().toFixed(2)} CFA</span>
                  </div>
                </div>
                
                <Button
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={items.length === 0 || isProcessing || isCreating}
                >
                  {(isProcessing || isCreating) ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payer maintenant
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
