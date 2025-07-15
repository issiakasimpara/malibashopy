
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Store, ShoppingCart, BarChart3, CreditCard, Globe, Zap, Shield, HeadphonesIcon } from "lucide-react";
import { Link } from "react-router-dom";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CtaSection from "@/components/home/CtaSection";
import TrustSection from "@/components/home/TrustSection";

const Index = () => {
  const features = [
    {
      icon: Store,
      title: "Création de boutique intelligente",
      description: "IA intégrée pour créer votre boutique en 3 minutes avec des templates adaptatifs et optimisés"
    },
    {
      icon: ShoppingCart,
      title: "Gestion produits avancée",
      description: "Import automatique, gestion des stocks en temps réel, variations produits illimitées"
    },
    {
      icon: BarChart3,
      title: "Analytics prédictives",
      description: "Tableaux de bord intelligents avec prédictions de ventes et recommandations IA"
    },
    {
      icon: CreditCard,
      title: "Paiements multicannaux",
      description: "35+ moyens de paiement, crypto-monnaies, paiement en plusieurs fois inclus"
    },
    {
      icon: Globe,
      title: "Expansion internationale",
      description: "Multi-devises, traduction automatique, gestion fiscale internationale"
    },
    {
      icon: Zap,
      title: "Performance ultime",
      description: "Sites ultra-rapides, CDN global, optimisation SEO automatique, score 100/100"
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: "29€",
      period: "/mois",
      description: "Parfait pour débuter",
      features: ["100 produits inclus", "Boutique responsive", "Support email", "SSL & sécurité", "Templates premium"],
      popular: false,
      badge: null
    },
    {
      name: "Business",
      price: "79€",
      period: "/mois",
      description: "Pour la croissance",
      features: ["Produits illimités", "Analytics avancées", "Support prioritaire", "API personnalisée", "Multi-devises", "Abandon cart recovery"],
      popular: true,
      badge: "Le plus populaire"
    },
    {
      name: "Enterprise",
      price: "199€",
      period: "/mois",
      description: "Performance maximale",
      features: ["Tout Business +", "Manager dédié", "Infrastructure dédiée", "SLA 99.99%", "Formation équipe", "White-label complet"],
      popular: false,
      badge: "Nouveau"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                <Store className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CommerceFlow
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Fonctionnalités</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Tarifs</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Témoignages</a>
              <a href="#support" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Support</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild className="font-medium">
                <Link to="/auth">Connexion</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <Link to="/dashboard">
                  Commencer <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Trust Section */}
      <TrustSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Tout ce dont vous avez besoin pour réussir
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Une plateforme révolutionnaire avec l'intelligence artificielle au cœur de chaque fonctionnalité
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600 leading-relaxed text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Des tarifs transparents qui grandissent avec vous
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Commencez gratuitement, évoluez selon vos besoins. Aucun frais caché.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-blue-500 border-2 shadow-2xl scale-105 bg-gradient-to-br from-blue-50 to-white' : 'border-gray-200 shadow-xl hover:shadow-2xl'} transition-all duration-300 hover:-translate-y-1`}>
                {plan.badge && (
                  <Badge className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${plan.popular ? 'bg-blue-600' : 'bg-purple-600'} text-white px-4 py-1`}>
                    {plan.badge}
                  </Badge>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  <div className="flex items-baseline justify-center mt-6">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 ml-2 text-lg">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className="w-5 h-5 bg-green-500 rounded-full mr-3 flex-shrink-0 flex items-center justify-center mt-0.5">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-gray-700 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full mt-8 py-3 ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : ''}`} variant={plan.popular ? "default" : "outline"}>
                    {plan.popular ? 'Commencer maintenant' : 'Choisir ce plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-24 h-24 mx-auto mb-8 flex items-center justify-center">
              <HeadphonesIcon className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Support expert français 24/7
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Notre équipe d'experts e-commerce français vous accompagne à chaque étape. 
              Chat en direct, documentation complète et communauté active de +10,000 membres.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-2 hover:bg-white">
                Documentation complète
              </Button>
              <Button size="lg" className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Chat avec un expert
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CtaSection />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                  <Store className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">CommerceFlow</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                La plateforme e-commerce française qui propulse votre business vers le succès avec l'intelligence artificielle.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm">📘</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm">🐦</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-sm">💼</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">Produit</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Intégrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Communauté</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-6 text-lg">Entreprise</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Presse</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400">&copy; 2024 CommerceFlow. Tous droits réservés. Fait avec ❤️ en France.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Confidentialité</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">CGU</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
