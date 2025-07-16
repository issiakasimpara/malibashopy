
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
import Shipping from "./pages/Shipping";

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
  
  // Liste des routes où le panier ne doit PAS apparaître (routes admin/marchands)
  const adminRoutes = [
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
    '/auth'
  ];
  
  // Vérifier si la route actuelle est une route admin/marchande
  const isAdminRoute = adminRoutes.some(route => location.pathname.startsWith(route));
  
  // Afficher le panier seulement sur les pages publiques/clients
  if (isAdminRoute) {
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
                    <Shipping />
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
