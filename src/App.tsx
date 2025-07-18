
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/hooks/useAuth";
import CartWidget from "@/components/site-builder/blocks/CartWidget";
import ErrorBoundary from "@/components/ErrorBoundary";
// ⚡ LAZY LOADING POUR OPTIMISER LE BUNDLE
import { lazy, Suspense } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

// Pages publiques (chargement immédiat)
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Pages admin (lazy loading)
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Products = lazy(() => import("./pages/Products"));
const Categories = lazy(() => import("./pages/Categories"));
const Orders = lazy(() => import("./pages/Orders"));
const Customers = lazy(() => import("./pages/Customers"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Settings = lazy(() => import("./pages/Settings"));
const StoreConfig = lazy(() => import("./pages/StoreConfig"));
const Domains = lazy(() => import("./pages/Domains"));
const CustomDomains = lazy(() => import("./pages/CustomDomains"));
const SiteBuilder = lazy(() => import("./pages/SiteBuilder"));
const TemplateEditor = lazy(() => import("./pages/TemplateEditor"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Payments = lazy(() => import("./pages/Payments"));
const MarketsShipping = lazy(() => import("./pages/MarketsShipping"));
const TestPage = lazy(() => import("./pages/TestPage"));

// Pages e-commerce (lazy loading)
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const CustomerOrders = lazy(() => import("./pages/CustomerOrders"));
const Storefront = lazy(() => import("./pages/Storefront"));
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const CartWidgetConditional = () => {
  const location = useLocation();

  // Liste des routes où le panier ne doit PAS apparaître
  const excludedRoutes = [
    // Routes admin/marchands
    '/dashboard',
    '/products',
    '/categories',
    '/orders',
    '/customers',
    '/shipping',
    '/analytics',
    '/settings',
    '/store-config',
    '/domains',
    '/testimonials',
    '/payments',
    '/auth',
    '/site-builder',
    '/template-editor',
    // Pages où le panier est déjà intégré ou non pertinent
    '/cart',
    '/checkout',
    '/payment-success',
    '/mes-commandes'
  ];

  // Vérifier si la route actuelle doit exclure le panier
  const shouldExclude = excludedRoutes.some(route => location.pathname.startsWith(route));

  // Vérifier si nous sommes sur la page d'accueil principale (pas une boutique)
  const isMainHomePage = location.pathname === '/';

  // Afficher le panier seulement sur les pages de boutiques publiques
  if (shouldExclude || isMainHomePage) {
    return null;
  }

  return <CartWidget />;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Routes>
              {/* Route de test */}
              <Route path="/test" element={<TestPage />} />

              {/* Routes publiques/clients */}
              <Route path="/" element={<Index />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/mes-commandes" element={<CustomerOrders />} />

              {/* Routes des boutiques publiques */}
              <Route path="/store/:storeSlug" element={<Storefront />} />
              <Route path="/store/:storeSlug/cart" element={<Cart />} />
              <Route path="/store/:storeSlug/checkout" element={<Checkout />} />
              <Route path="/store/:storeSlug/payment-success" element={<PaymentSuccess />} />
              
              {/* Routes d'authentification */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Routes marchands/admin (protégées) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Dashboard />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categories"
                element={
                  <ProtectedRoute>
                    <Categories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers"
                element={
                  <ProtectedRoute>
                    <Customers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shipping"
                element={
                  <ProtectedRoute>
                    <MarketsShipping />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/store-config"
                element={
                  <ProtectedRoute>
                    <StoreConfig />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/domains"
                element={
                  <ProtectedRoute>
                    <CustomDomains />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/store-config/site-builder"
                element={
                  <ProtectedRoute>
                    <SiteBuilder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/store-config/site-builder/editor/:templateId"
                element={
                  <ProtectedRoute>
                    <TemplateEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/testimonials"
                element={
                  <ProtectedRoute>
                    <Testimonials />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments"
                element={
                  <ProtectedRoute>
                    <Payments />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CartWidgetConditional />
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
