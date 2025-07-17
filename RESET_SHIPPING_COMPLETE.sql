-- ========================================
-- SCRIPT DE NETTOYAGE COMPLET DES LIVRAISONS
-- SUPPRIME TOUT ET REPART DE ZÉRO
-- ========================================

-- 1. SUPPRIMER TOUTES LES MÉTHODES DE LIVRAISON
DELETE FROM public.shipping_methods;

-- 2. SUPPRIMER TOUTES LES ZONES DE LIVRAISON
DELETE FROM public.shipping_zones;

-- 3. REMETTRE LES COMPTEURS À ZÉRO (optionnel)
-- ALTER SEQUENCE shipping_methods_id_seq RESTART WITH 1;
-- ALTER SEQUENCE shipping_zones_id_seq RESTART WITH 1;

-- 4. VÉRIFICATION : TOUT DOIT ÊTRE VIDE
SELECT 'Méthodes restantes' as type, count(*) as count FROM public.shipping_methods
UNION ALL
SELECT 'Zones restantes' as type, count(*) as count FROM public.shipping_zones;

-- 5. AFFICHER LA STRUCTURE DES TABLES POUR VÉRIFICATION
SELECT 
    'Structure shipping_methods' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'shipping_methods' 
ORDER BY ordinal_position;

SELECT 
    'Structure shipping_zones' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'shipping_zones' 
ORDER BY ordinal_position;

-- RÉSULTAT ATTENDU :
-- - 0 méthodes de livraison
-- - 0 zones de livraison
-- - Tables vides et prêtes pour un nouveau départ

-- ========================================
-- MAINTENANT TOUT EST PROPRE !
-- ON PEUT REPARTIR DE ZÉRO
-- ========================================
