
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/hooks/useAuth";
import CartWidget from "@/components/site-builder/blocks/CartWidget";
import ErrorBoundary from "@/components/ErrorBoundary";
// ⚡ ÉTAPE 2: LAZY LOADING PROGRESSIF
import { lazy, Suspense } from 'react';
import { LazyRoute } from '@/components/LazyWrapper';

// Pages critiques (chargement immédiat)
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";

// Pages importantes (chargement immédiat)
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Storefront from "./pages/Storefront";

// ÉTAPE 2A: Pages moins critiques (lazy loading)
const Analytics = lazy(() => import("./pages/Analytics"));
const Settings = lazy(() => import("./pages/Settings"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const TestPage = lazy(() => import("./pages/TestPage"));

// ÉTAPE 2B: Pages de configuration (lazy loading)
const Categories = lazy(() => import("./pages/Categories"));
const Customers = lazy(() => import("./pages/Customers"));
const StoreConfig = lazy(() => import("./pages/StoreConfig"));
const Domains = lazy(() => import("./pages/Domains"));
const CustomDomains = lazy(() => import("./pages/CustomDomains"));
const Payments = lazy(() => import("./pages/Payments"));
const MarketsShipping = lazy(() => import("./pages/MarketsShipping"));

// ÉTAPE 2C: Pages complexes (lazy loading)
const SiteBuilder = lazy(() => import("./pages/SiteBuilder"));
const TemplateEditor = lazy(() => import("./pages/TemplateEditor"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const CustomerOrders = lazy(() => import("./pages/CustomerOrders"));
import ProtectedRoute from "./components/ProtectedRoute";

// ⚡ ÉTAPE 3: Monitoring en temps réel (dev uniquement)
import React, { useState } from 'react';
import PerformanceMonitor from './components/PerformanceMonitor';

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

const App = () => {
  // ⚡ ÉTAPE 3: État du moniteur de performance
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(
    import.meta.env.DEV && localStorage.getItem('showPerformanceMonitor') === 'true'
  );

  // Raccourci clavier pour toggle le moniteur (Ctrl+Shift+P)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P' && import.meta.env.DEV) {
        setShowPerformanceMonitor(prev => {
          const newValue = !prev;
          localStorage.setItem('showPerformanceMonitor', String(newValue));
          return newValue;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
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
                    <Dashboard />
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
                    <LazyRoute
                      component={Analytics}
                      fallbackMessage="Chargement des analytics..."
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <LazyRoute
                      component={Settings}
                      fallbackMessage="Chargement des paramètres..."
                    />
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

            {/* ⚡ ÉTAPE 3: Moniteur de performance (dev uniquement) */}
            {import.meta.env.DEV && (
              <PerformanceMonitor
                isVisible={showPerformanceMonitor}
                onClose={() => {
                  setShowPerformanceMonitor(false);
                  localStorage.setItem('showPerformanceMonitor', 'false');
                }}
              />
            )}
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
  </ErrorBoundary>
  );
};

export default App;
