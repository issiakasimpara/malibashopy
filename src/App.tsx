
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthButton } from "@/components/auth/AuthButton";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Restauration progressive des pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Categories from "./pages/Categories";
import Customers from "./pages/Customers";
import MarketsShipping from "./pages/MarketsShipping";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Testimonials from "./pages/Testimonials";
import Themes from "./pages/Themes";
import Domains from "./pages/Domains";
import StoreConfig from "./pages/StoreConfig";
import Payments from "./pages/Payments";
import NotFound from "./pages/NotFound";

// Page de test Clerk
const TestPage = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold text-center mb-6">🎉 Clerk Authentification</h1>
      <div className="space-y-4">
        <SignedOut>
          <div className="text-center">
            <p className="text-gray-600 mb-4">Connectez-vous pour accéder à l'application.</p>
            <AuthButton />
          </div>
        </SignedOut>
        <SignedIn>
          <div className="text-center">
            <p className="text-green-600 mb-4">✅ Vous êtes connecté avec succès !</p>
            <p className="text-sm text-gray-500 mb-4">L'authentification Clerk fonctionne parfaitement.</p>
            <AuthButton />
          </div>
        </SignedIn>
      </div>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Page d'accueil publique */}
              <Route path="/" element={<Index />} />

              {/* Pages protégées - Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Pages protégées - Produits */}
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                }
              />

              {/* Pages protégées - Commandes */}
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />

              {/* Pages protégées - Autres sections */}
              <Route
                path="/categories"
                element={
                  <ProtectedRoute>
                    <Categories />
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

              {/* Pages manquantes restaurées */}
              <Route
                path="/testimonials"
                element={
                  <ProtectedRoute>
                    <Testimonials />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/themes"
                element={
                  <ProtectedRoute>
                    <Themes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/domains"
                element={
                  <ProtectedRoute>
                    <Domains />
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
                path="/payments"
                element={
                  <ProtectedRoute>
                    <Payments />
                  </ProtectedRoute>
                }
              />

              {/* Page de test Clerk (temporaire) */}
              <Route path="/test-auth" element={<TestPage />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
