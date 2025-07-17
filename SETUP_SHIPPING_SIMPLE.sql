-- ========================================
-- CONFIGURATION SIMPLE DES LIVRAISONS
-- VERSION PROPRE ET SIMPLE
-- ========================================

-- Vérifier que les tables sont bien vides
SELECT 'Vérification avant setup' as status;
SELECT count(*) as shipping_methods_count FROM shipping_methods;
SELECT count(*) as shipping_zones_count FROM shipping_zones;

-- ========================================
-- ÉTAPE 1: CRÉER DES MÉTHODES DE TEST POUR LA PREMIÈRE BOUTIQUE
-- ========================================

-- Récupérer l'ID de la première boutique
DO $$
DECLARE
    first_store_id UUID;
BEGIN
    -- Trouver la première boutique
    SELECT id INTO first_store_id 
    FROM stores 
    ORDER BY created_at ASC 
    LIMIT 1;
    
    IF first_store_id IS NOT NULL THEN
        RAISE NOTICE 'Création de méthodes pour la boutique: %', first_store_id;
        
        -- Créer 3 méthodes simples
        INSERT INTO shipping_methods (
            store_id,
            name,
            description,
            price,
            estimated_days,
            icon,
            is_active,
            sort_order
        ) VALUES
        (
            first_store_id,
            'Livraison Standard',
            'Livraison standard en 5-7 jours',
            2500,
            '5-7 jours',
            '📦',
            true,
            1
        ),
        (
            first_store_id,
            'Livraison Express',
            'Livraison rapide en 2-3 jours',
            5000,
            '2-3 jours',
            '⚡',
            true,
            2
        ),
        (
            first_store_id,
            'Livraison Économique',
            'Livraison économique en 7-10 jours',
            1500,
            '7-10 jours',
            '💰',
            true,
            3
        );
        
        RAISE NOTICE 'Méthodes créées avec succès !';
    ELSE
        RAISE NOTICE 'Aucune boutique trouvée';
    END IF;
END $$;

-- ========================================
-- VÉRIFICATION FINALE
-- ========================================

SELECT 'Résultat final' as status;

-- Afficher les méthodes créées
SELECT 
    sm.id,
    s.name as store_name,
    sm.name as method_name,
    sm.price,
    sm.estimated_days,
    sm.is_active
FROM shipping_methods sm
JOIN stores s ON sm.store_id = s.id
ORDER BY sm.sort_order;

-- Compter les méthodes
SELECT count(*) as total_methods_created FROM shipping_methods;

-- ========================================
-- RÉSULTAT ATTENDU:
-- - 3 méthodes créées pour la première boutique
-- - Toutes actives et prêtes à être utilisées
-- ========================================
