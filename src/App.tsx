
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/hooks/useAuth";
import CartWidget from "@/components/site-builder/blocks/CartWidget";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import SimpleIndex from "./pages/SimpleIndex";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import StoreConfig from "./pages/StoreConfig";
import Domains from "./pages/Domains";
import CustomDomains from "./pages/CustomDomains";
import SiteBuilder from "./pages/SiteBuilder";
import TemplateEditor from "./pages/TemplateEditor";
import Testimonials from "./pages/Testimonials";
import Payments from "./pages/Payments";
import MarketsShipping from "./pages/MarketsShipping";
import TestPage from "./pages/TestPage";

import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import CustomerOrders from "./pages/CustomerOrders";
import Storefront from "./pages/Storefront";
import NotFound from "./pages/NotFound";
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
