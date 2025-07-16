
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { Trash2, CreditCard, Loader2, Truck, Clock, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useOrders } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';
import { useCheckoutShipping } from '@/hooks/usePublicShipping';
import { supabase } from '@/integrations/supabase/client';
import { AFRICAN_FRANCOPHONE_COUNTRIES } from '@/constants/africanCountries';

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
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Hook pour récupérer les méthodes de livraison
  const { shippingOptions, isLoading: isLoadingShipping } = useCheckoutShipping(
    storeSlug,
    customerInfo.country,
    getTotalPrice()
  );

  const handleCustomerInfoChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calculer le coût de livraison sélectionné
  const getShippingCost = () => {
    if (!selectedShippingMethod) return 0;
    const method = shippingOptions.find(m => m.id === selectedShippingMethod);
    return method ? method.calculatedPrice : 0;
  };

  // Calculer le total avec livraison
  const getTotalWithShipping = () => {
    return getTotalPrice() + getShippingCost();
  };

  // Réinitialiser la méthode de livraison quand le pays change
  useEffect(() => {
    setSelectedShippingMethod('');
  }, [customerInfo.country]);

  // Sélectionner automatiquement la première méthode disponible
  useEffect(() => {
    if (shippingOptions.length > 0 && !selectedShippingMethod) {
      setSelectedShippingMethod(shippingOptions[0].id);
    }
  }, [shippingOptions, selectedShippingMethod]);

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

    if (!selectedShippingMethod) {
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

              {/* Section méthodes de livraison */}
              {customerInfo.country && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <Label className="text-base font-medium flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Méthode de livraison *
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Choisissez comment vous souhaitez recevoir votre commande
                    </p>
                  </div>

                  {isLoadingShipping ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Chargement des options de livraison...</span>
                    </div>
                  ) : shippingOptions.length > 0 ? (
                    <RadioGroup value={selectedShippingMethod} onValueChange={setSelectedShippingMethod}>
                      {shippingOptions.map((method) => (
                        <div key={method.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value={method.id} id={method.id} />
                          <label htmlFor={method.id} className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{method.icon}</span>
                                <div>
                                  <p className="font-medium">{method.name}</p>
                                  <p className="text-sm text-gray-600">{method.description}</p>
                                  <div className="flex items-center gap-4 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {method.estimatedDays}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">
                                  {method.calculatedPrice === 0 ? 'Gratuit' : `${method.calculatedPrice.toFixed(0)} CFA`}
                                </p>
                                {method.calculatedPrice !== method.price && method.price > 0 && (
                                  <p className="text-sm text-gray-500 line-through">
                                    {method.price.toFixed(0)} CFA
                                  </p>
                                )}
                              </div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Truck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucune méthode de livraison disponible pour ce pays</p>
                      <p className="text-sm">Veuillez contacter le vendeur</p>
                    </div>
                  )}
                </div>
              )}
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
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total:</span>
                    <span>{getTotalPrice().toFixed(0)} CFA</span>
                  </div>

                  {selectedShippingMethod && (
                    <div className="flex justify-between">
                      <span>Livraison:</span>
                      <span>
                        {getShippingCost() === 0 ? 'Gratuit' : `${getShippingCost().toFixed(0)} CFA`}
                      </span>
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
                  disabled={items.length === 0 || isProcessing || isCreating || !selectedShippingMethod || !customerInfo.country}
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
