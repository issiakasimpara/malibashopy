
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { Trash2, CreditCard, Loader2, Truck, Clock, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useOrders } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AFRICAN_FRANCOPHONE_COUNTRIES = [
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪' },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳' },
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: 'GN', name: 'Guinée', flag: '🇬🇳' },
  { code: 'BJ', name: 'Bénin', flag: '🇧🇯' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬' },
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲' },
  { code: 'TD', name: 'Tchad', flag: '🇹🇩' },
  { code: 'CF', name: 'République centrafricaine', flag: '🇨🇫' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦' },
  { code: 'CG', name: 'République du Congo', flag: '🇨🇬' },
  { code: 'CD', name: 'République démocratique du Congo', flag: '🇨🇩' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬' },
  { code: 'KM', name: 'Comores', flag: '🇰🇲' }
];

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

  const [shippingMethods, setShippingMethods] = useState<any[]>([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<any>(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCustomerInfoChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Charger les méthodes de livraison au chargement de la page
  useEffect(() => {
    const initializeShipping = async () => {
      try {
        const storeInfo = await getStoreInfo();
        if (storeInfo) {
          await loadShippingMethods(storeInfo.id);
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation des méthodes de livraison:', error);
      }
    };

    initializeShipping();
  }, [storeSlug]);

  // Charger les méthodes de livraison
  const loadShippingMethods = async (storeId: string) => {
    try {
      const { data, error } = await supabase
        .from('shipping_methods')
        .select(`
          *,
          shipping_zones (
            id,
            name,
            countries
          )
        `)
        .eq('store_id', storeId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      console.log('📦 Méthodes de livraison chargées:', data);
      setShippingMethods(data || []);

      // Sélectionner automatiquement la première méthode si disponible
      if (data && data.length > 0) {
        setSelectedShippingMethod(data[0]);
        setShippingCost(data[0].price || 0);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des méthodes de livraison:', error);
    }
  };

  // Calculer le total avec livraison
  const getTotalWithShipping = () => {
    return getTotalPrice() + shippingCost;
  };

  const handleCheckout = async () => {
    // Validation des champs requis
    if (!customerInfo.email || !customerInfo.firstName || !customerInfo.lastName || !customerInfo.address || !customerInfo.country) {
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

    if (shippingMethods.length > 0 && !selectedShippingMethod) {
      toast({
        title: "Méthode de livraison manquante",
        description: "Veuillez sélectionner une méthode de livraison.",
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

      // Charger les méthodes de livraison si pas encore fait
      if (shippingMethods.length === 0) {
        await loadShippingMethods(storeInfo.id);
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
        totalAmount: getTotalWithShipping(),
        currency: 'CFA',
        shippingCost: shippingCost,
        shippingMethod: selectedShippingMethod
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
      // Si nous avons le slug dans l'URL, récupérer la vraie boutique
      if (storeSlug) {
        console.log('🔍 Recherche boutique par slug:', storeSlug);

        // Appel API pour récupérer la boutique par son slug/nom
        const { data: stores, error } = await supabase
          .from('stores')
          .select('id, name')
          .ilike('name', `%${storeSlug.replace('-', ' ')}%`)
          .limit(1);

        if (error) {
          console.error('❌ Erreur recherche boutique:', error);
        } else if (stores && stores.length > 0) {
          console.log('✅ Boutique trouvée:', stores[0]);
          return stores[0];
        }
      }

      // Sinon, essayer de récupérer depuis le localStorage ou le contexte
      const storeData = localStorage.getItem('currentStore');
      if (storeData) {
        const parsed = JSON.parse(storeData);
        console.log('📦 Boutique depuis localStorage:', parsed);
        return parsed;
      }

      // Fallback: récupérer la première boutique disponible
      console.log('🔄 Fallback: recherche première boutique');
      const { data: stores, error } = await supabase
        .from('stores')
        .select('id, name')
        .limit(1);

      if (error) {
        console.error('❌ Erreur fallback boutique:', error);
        throw new Error('Aucune boutique trouvée');
      }

      if (stores && stores.length > 0) {
        console.log('✅ Boutique fallback:', stores[0]);
        return stores[0];
      }

      throw new Error('Aucune boutique disponible');
    } catch (error) {
      console.error('❌ Erreur récupération boutique:', error);
      throw error;
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

              <div>
                <Label htmlFor="country">Pays *</Label>
                <Select value={customerInfo.country} onValueChange={(value) => handleCustomerInfoChange('country', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre pays" />
                  </SelectTrigger>
                  <SelectContent>
                    {AFRICAN_FRANCOPHONE_COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <div className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span>{country.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>


            </CardContent>
          </Card>

          {/* Méthodes de livraison */}
          {shippingMethods.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Méthodes de livraison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {shippingMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedShippingMethod?.id === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedShippingMethod(method);
                      setShippingCost(method.price || 0);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                          {selectedShippingMethod?.id === method.id && (
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{method.name}</h4>
                          {method.description && (
                            <p className="text-sm text-gray-600">{method.description}</p>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Clock className="h-4 w-4" />
                            <span>{method.estimated_days}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {method.price === 0 ? (
                            <span className="text-green-600">Gratuit</span>
                          ) : (
                            <span>{method.price} CFA</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

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
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total:</span>
                    <span>{getTotalPrice().toFixed(0)} CFA</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Livraison:</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Gratuit</span>
                      ) : (
                        `${shippingCost} CFA`
                      )}
                    </span>
                  </div>

                  {selectedShippingMethod && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Méthode:</span>
                      <span>{selectedShippingMethod.name}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>{getTotalWithShipping().toFixed(0)} CFA</span>
                  </div>
                </div>
                
                <Button
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={items.length === 0 || isProcessing || isCreating || !customerInfo.country || (shippingMethods.length > 0 && !selectedShippingMethod)}
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
