# 🚀 GUIDE COMPLET : MIGRATION SUPABASE → NEON + CLERK

## 🎯 OBJECTIF
Migrer votre application MalibaShopy de Supabase vers Neon (base de données) + Clerk (authentification) sans perdre aucune donnée ni configuration.

---

## ⏱️ TEMPS ESTIMÉ : 1H30

- 🛡️ **Sauvegarde** : 10 min
- 🌐 **Création comptes** : 20 min
- 📊 **Export données** : 15 min
- 🔧 **Configuration** : 30 min
- 🧪 **Tests** : 15 min

---

## 📋 PHASE 1 : SAUVEGARDE (10 MIN)

### ✅ ÉTAPE 1.1 : Sauvegarder votre code

1. **Ouvrez** votre terminal dans le dossier du projet
2. **Tapez** ces commandes une par une :

```bash
# Créer une branche de sauvegarde
git add .
git commit -m "Sauvegarde avant migration Neon+Clerk"
git branch sauvegarde-supabase

# Vérifier que la sauvegarde est créée
git branch
```

3. **Vous devriez voir** : `sauvegarde-supabase` dans la liste

### ✅ ÉTAPE 1.2 : Copie de sécurité du dossier

1. **Copiez** tout le dossier `ecom-express-shop-main`
2. **Renommez** la copie en `ecom-express-shop-BACKUP`
3. **Gardez** cette copie intacte

---

## 📋 PHASE 2 : CRÉATION DES COMPTES (20 MIN)

### ✅ ÉTAPE 2.1 : Créer le compte Neon Database

1. **Allez** sur https://neon.tech
2. **Cliquez** "Sign up" (S'inscrire)
3. **Choisissez** "Continue with GitHub" ou "Continue with Google"
4. **Confirmez** votre e-mail si demandé

5. **Créer un nouveau projet :**
   - **Cliquez** "Create a project"
   - **Project name** : `malibashopy`
   - **Database name** : `malibashopy_db`
   - **Region** : `Europe (Frankfurt)` ou `Europe (Amsterdam)`
   - **PostgreSQL version** : `15` (par défaut)
   - **Cliquez** "Create project"

6. **Récupérer la connection string :**
   - **Allez** dans "Dashboard"
   - **Cliquez** "Connection string"
   - **Copiez** la string qui commence par `postgresql://`
   - **Notez-la** quelque part (ex: Bloc-notes)

### ✅ ÉTAPE 2.2 : Créer le compte Clerk Auth

1. **Allez** sur https://clerk.com
2. **Cliquez** "Get started for free"
3. **Choisissez** "Continue with GitHub" ou "Continue with Google"
4. **Confirmez** votre e-mail si demandé

5. **Créer une nouvelle application :**
   - **Application name** : `MalibaShopy`
   - **How will your users sign in?** : Cochez `Email address`
   - **Cliquez** "Create application"

6. **Récupérer les clés :**
   - Vous êtes sur la page "API Keys"
   - **Copiez** le "Publishable key" (commence par `pk_test_`)
   - **Copiez** le "Secret key" (commence par `sk_test_`)
   - **Notez-les** quelque part

---

## 📋 PHASE 3 : EXPORT DES DONNÉES SUPABASE (15 MIN)

### ✅ ÉTAPE 3.1 : Se connecter à Supabase

1. **Allez** sur https://supabase.com
2. **Connectez-vous** à votre compte
3. **Ouvrez** votre projet MalibaShopy

### ✅ ÉTAPE 3.2 : Exporter les tables importantes

**Pour chaque table suivante, répétez ces étapes :**

**Tables à exporter :**
- `profiles`
- `stores` 
- `products`
- `categories`
- `public_orders`
- `shipping_methods`

**Étapes pour chaque table :**
1. **Cliquez** "Table Editor" dans le menu gauche
2. **Sélectionnez** la table (ex: `profiles`)
3. **Cliquez** les 3 points `...` en haut à droite
4. **Cliquez** "Export as CSV"
5. **Téléchargez** le fichier
6. **Renommez** le fichier : `profiles_backup.csv`
7. **Répétez** pour toutes les tables

### ✅ ÉTAPE 3.3 : Créer un dossier de sauvegarde

1. **Créez** un dossier `backup_supabase` sur votre Bureau
2. **Déplacez** tous les fichiers CSV dans ce dossier

---

## 📋 PHASE 4 : INSTALLATION DES DÉPENDANCES (10 MIN)

### ✅ ÉTAPE 4.1 : Installer Clerk

1. **Ouvrez** le terminal dans votre projet
2. **Tapez** cette commande :

```bash
npm install @clerk/clerk-react
```

3. **Attendez** que l'installation se termine

### ✅ ÉTAPE 4.2 : Installer Prisma (ORM pour Neon)

```bash
npm install prisma @prisma/client
npm install -D prisma
```

### ✅ ÉTAPE 4.3 : Initialiser Prisma

```bash
npx prisma init
```

---

## 📋 PHASE 5 : CONFIGURATION (30 MIN)

### ✅ ÉTAPE 5.1 : Configurer les variables d'environnement

1. **Ouvrez** le fichier `.env.local` dans votre éditeur
2. **Remplacez** tout le contenu par :

```env
# Neon Database
DATABASE_URL="VOTRE_CONNECTION_STRING_NEON_ICI"

# Clerk Auth
VITE_CLERK_PUBLISHABLE_KEY=VOTRE_PUBLISHABLE_KEY_ICI
CLERK_SECRET_KEY=VOTRE_SECRET_KEY_ICI

# App Config
VITE_APP_URL=http://localhost:8080
```

3. **Remplacez** :
   - `VOTRE_CONNECTION_STRING_NEON_ICI` par votre string Neon
   - `VOTRE_PUBLISHABLE_KEY_ICI` par votre clé Clerk publique
   - `VOTRE_SECRET_KEY_ICI` par votre clé Clerk secrète

4. **Sauvegardez** le fichier

### ✅ ÉTAPE 5.2 : Configurer le schéma Prisma

1. **Ouvrez** le fichier `prisma/schema.prisma`
2. **Remplacez** tout le contenu par le schéma que je vais créer dans le fichier suivant

---

## 📋 PHASE 6 : TESTS ET VALIDATION (15 MIN)

### ✅ ÉTAPE 6.1 : Tester la connexion Neon

```bash
npx prisma db push
```

### ✅ ÉTAPE 6.2 : Générer le client Prisma

```bash
npx prisma generate
```

### ✅ ÉTAPE 6.3 : Démarrer l'application

```bash
npm run dev
```

---

## 🚨 EN CAS DE PROBLÈME

### 🔄 ROLLBACK COMPLET

Si quelque chose ne marche pas :

1. **Arrêtez** l'application (Ctrl+C)
2. **Revenez** à la sauvegarde :

```bash
git checkout sauvegarde-supabase
```

3. **Ou utilisez** la copie du dossier `ecom-express-shop-BACKUP`

### 📞 AIDE

Si vous êtes bloqué à une étape :
1. **Notez** le numéro de l'étape
2. **Copiez** le message d'erreur exact
3. **Demandez-moi** de l'aide avec ces informations

---

## ✅ CHECKLIST DE PROGRESSION

- [ ] Phase 1 : Sauvegarde créée
- [ ] Phase 2 : Comptes Neon + Clerk créés
- [ ] Phase 3 : Données Supabase exportées
- [ ] Phase 4 : Dépendances installées
- [ ] Phase 5 : Configuration terminée
- [ ] Phase 6 : Tests réussis

---

## 🎯 PROCHAINES ÉTAPES

Une fois ce guide terminé, je vous aiderai à :
1. **Créer** le schéma Prisma détaillé
2. **Migrer** vos données vers Neon
3. **Configurer** Clerk dans votre application
4. **Tester** toutes les fonctionnalités

**🚀 Commencez par la Phase 1 et dites-moi quand vous avez terminé chaque phase !**
