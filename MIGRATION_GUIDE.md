# 🔄 GUIDE DE MIGRATION SUPABASE

## 📋 ÉTAPES DE MIGRATION COMPLÈTE

### 🎯 ÉTAPE 1 : CRÉER LE NOUVEAU PROJET

1. **Allez** sur https://supabase.com
2. **Créez** un nouveau projet :
   - **Nom** : `malibashopy-clean`
   - **Région** : Même région que l'ancien
   - **Mot de passe** : Nouveau mot de passe fort

### 🎯 ÉTAPE 2 : EXPORT DES DONNÉES ACTUELLES

#### **📊 Tables à exporter :**
- `profiles` - Profils utilisateurs
- `stores` - Boutiques
- `products` - Produits
- `categories` - Catégories
- `public_orders` - Commandes
- `shipping_methods` - Méthodes de livraison

#### **📤 Méthode d'export :**
1. **Table Editor** > Sélectionner table > `...` > `Export as CSV`
2. **Répéter** pour chaque table importante

### 🎯 ÉTAPE 3 : CRÉER LE SCHÉMA DANS LE NOUVEAU PROJET

#### **📋 Script SQL à exécuter dans le nouveau projet :**

```sql
-- 1. CRÉER LA TABLE PROFILES
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CRÉER LA TABLE STORES
CREATE TABLE public.stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  merchant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active',
  logo_url TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CRÉER LA TABLE CATEGORIES
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CRÉER LA TABLE PRODUCTS
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  images TEXT[],
  category TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CRÉER LA TABLE PUBLIC_ORDERS
CREATE TABLE public.public_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'XOF',
  status TEXT DEFAULT 'pending',
  shipping_address JSONB,
  billing_address JSONB,
  shipping_method JSONB,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  shipping_country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. CRÉER LA TABLE SHIPPING_METHODS
CREATE TABLE public.shipping_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  delivery_time TEXT,
  countries TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 🎯 ÉTAPE 4 : CONFIGURER L'AUTHENTIFICATION

#### **⚙️ Paramètres d'authentification :**
1. **Authentication** > **Settings** :
   - **Site URL** : `http://localhost:8080`
   - **Redirect URLs** : `http://localhost:8080/**`
   - **Email confirmations** : `DÉSACTIVÉ` (pour les tests)

### 🎯 ÉTAPE 5 : CRÉER LES POLITIQUES RLS

```sql
-- POLITIQUES POUR PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id OR auth.uid() = user_id);

-- POLITIQUES POUR STORES
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own stores" ON public.stores
  FOR ALL USING (auth.uid() = user_id OR auth.uid() = merchant_id);

-- POLITIQUES POUR PRODUCTS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Store owners can manage products" ON public.products
  FOR ALL USING (
    store_id IN (
      SELECT id FROM public.stores 
      WHERE user_id = auth.uid() OR merchant_id = auth.uid()
    )
  );

-- POLITIQUES POUR ORDERS (accès public pour recherche)
ALTER TABLE public.public_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view orders" ON public.public_orders
  FOR SELECT USING (true);
CREATE POLICY "Store owners can manage orders" ON public.public_orders
  FOR ALL USING (
    store_id IN (
      SELECT id FROM public.stores 
      WHERE user_id = auth.uid() OR merchant_id = auth.uid()
    )
  );
```

### 🎯 ÉTAPE 6 : CRÉER LES TRIGGERS

```sql
-- FONCTION POUR CRÉER AUTOMATIQUEMENT UN PROFIL
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGER POUR NOUVEAUX UTILISATEURS
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 🎯 ÉTAPE 7 : IMPORTER LES DONNÉES

1. **Table Editor** > Sélectionner table > `Insert` > `Import from CSV`
2. **Uploader** les fichiers CSV exportés
3. **Mapper** les colonnes correctement

### 🎯 ÉTAPE 8 : METTRE À JOUR .ENV.LOCAL

```env
# Nouvelles clés du nouveau projet
VITE_SUPABASE_URL=https://NOUVEAU_ID.supabase.co
VITE_SUPABASE_ANON_KEY=NOUVELLE_CLE_ANON
```

### 🎯 ÉTAPE 9 : TESTER

1. **Redémarrer** l'application
2. **Tester** l'authentification
3. **Vérifier** que les données sont présentes
4. **Tester** toutes les fonctionnalités

## ✅ AVANTAGES DE LA MIGRATION

- 🧹 **Base propre** sans corruption
- 🔐 **Authentification fraîche** 
- 🚀 **Performance optimale**
- 🛡️ **Sécurité renforcée**
- 🔧 **Configuration maîtrisée**

## ⚠️ POINTS D'ATTENTION

- 📋 **Sauvegarder** toutes les données importantes
- 🔑 **Noter** les nouvelles clés API
- 👥 **Recréer** les comptes utilisateurs
- 🧪 **Tester** chaque fonctionnalité

## 🎯 RÉSULTAT FINAL

Une application MalibaShopy complètement fonctionnelle avec :
- ✅ Authentification qui marche
- ✅ Toutes vos données préservées
- ✅ Base de données propre et optimisée
- ✅ Plus de problèmes de connectivité
