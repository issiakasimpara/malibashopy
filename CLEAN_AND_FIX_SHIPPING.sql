-- ========================================
-- SCRIPT POUR NETTOYER ET RECRÉER LES TABLES DE LIVRAISON
-- PAYS INDÉPENDANTS - PAS DE ZONES !
-- ========================================

-- 1. SUPPRIMER TOUTES LES DONNÉES EXISTANTES
DELETE FROM public.shipping_methods;
DELETE FROM public.shipping_zones;

-- 2. SUPPRIMER LES ANCIENNES TABLES SI ELLES EXISTENT
DROP TABLE IF EXISTS public.shipping_methods CASCADE;
DROP TABLE IF EXISTS public.shipping_zones CASCADE;

-- 3. CRÉER LA NOUVELLE TABLE SHIPPING_METHODS SIMPLE
CREATE TABLE public.shipping_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    store_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    estimated_days TEXT NOT NULL DEFAULT '3-5 jours',
    icon TEXT DEFAULT '🚚',
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    available_countries TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CRÉER LES INDEX POUR LES PERFORMANCES
CREATE INDEX idx_shipping_methods_store_id ON public.shipping_methods(store_id);
CREATE INDEX idx_shipping_methods_active ON public.shipping_methods(is_active);
CREATE INDEX idx_shipping_methods_countries ON public.shipping_methods USING GIN(available_countries);

-- 5. DÉSACTIVER RLS POUR LES TESTS
ALTER TABLE public.shipping_methods DISABLE ROW LEVEL SECURITY;

-- 6. CRÉER LES MÉTHODES PAR DÉFAUT POUR LA PREMIÈRE BOUTIQUE
DO $$
DECLARE
    first_store_id UUID;
BEGIN
    -- Récupérer la première boutique
    SELECT id INTO first_store_id FROM public.stores LIMIT 1;
    
    IF first_store_id IS NOT NULL THEN
        -- Insérer les méthodes par défaut
        INSERT INTO public.shipping_methods (
            store_id, 
            name, 
            description, 
            price, 
            estimated_days, 
            icon, 
            sort_order,
            available_countries
        ) VALUES
        (
            first_store_id,
            'Livraison Standard',
            'Livraison standard dans toute l''Afrique francophone',
            2500,
            '5-7 jours ouvrables',
            '🚚',
            1,
            ARRAY['ML', 'SN', 'BF', 'CI', 'NE', 'TG', 'BJ', 'GN', 'CM', 'TD', 'CF', 'GA', 'CG', 'CD', 'MG', 'DZ', 'MA', 'TN']
        ),
        (
            first_store_id,
            'Livraison Express',
            'Livraison rapide dans toute l''Afrique francophone',
            5000,
            '2-3 jours ouvrables',
            '⚡',
            2,
            ARRAY['ML', 'SN', 'BF', 'CI', 'NE', 'TG', 'BJ', 'GN', 'CM', 'TD', 'CF', 'GA', 'CG', 'CD', 'MG', 'DZ', 'MA', 'TN']
        ),
        (
            first_store_id,
            'Livraison Économique',
            'Livraison économique (délai plus long)',
            1500,
            '7-10 jours ouvrables',
            '💰',
            3,
            ARRAY['ML', 'SN', 'BF', 'CI', 'NE', 'TG', 'BJ', 'GN', 'CM', 'TD', 'CF', 'GA', 'CG', 'CD', 'MG', 'DZ', 'MA', 'TN']
        ),
        (
            first_store_id,
            'Livraison Gratuite',
            'Livraison gratuite pour commandes > 50 000 CFA',
            0,
            '10-14 jours ouvrables',
            '🎁',
            4,
            ARRAY['ML', 'SN', 'BF', 'CI', 'NE', 'TG', 'BJ', 'GN', 'CM', 'TD', 'CF', 'GA', 'CG', 'CD', 'MG', 'DZ', 'MA', 'TN']
        );
        
        RAISE NOTICE 'Méthodes créées pour la boutique: %', first_store_id;
    ELSE
        RAISE NOTICE 'Aucune boutique trouvée';
    END IF;
END $$;

-- 7. VÉRIFICATION FINALE
SELECT 
    'shipping_methods' as table_name, 
    count(*) as row_count,
    array_agg(DISTINCT store_id) as store_ids
FROM public.shipping_methods;

-- 8. AFFICHER LES MÉTHODES CRÉÉES
SELECT 
    id,
    store_id,
    name,
    price,
    estimated_days,
    array_length(available_countries, 1) as countries_count,
    available_countries[1:3] as sample_countries
FROM public.shipping_methods
ORDER BY sort_order;

-- 9. TESTER POUR LE MALI
SELECT 
    name,
    price,
    estimated_days,
    'ML' = ANY(available_countries) as available_for_mali
FROM public.shipping_methods
WHERE 'ML' = ANY(available_countries)
ORDER BY sort_order;

-- FIN DU SCRIPT
-- Résultat attendu: 4 méthodes créées, toutes disponibles pour le Mali
