-- ========================================
-- SCRIPT POUR SUPPRIMER LES DONNÉES FACTICES
-- ET GARDER SEULEMENT LES VRAIES MÉTHODES DE L'ADMIN
-- ========================================

-- 1. SUPPRIMER TOUTES LES DONNÉES FACTICES CRÉÉES PAR LE SCRIPT
DELETE FROM public.shipping_methods 
WHERE name IN (
  'Livraison Standard Afrique',
  'Livraison Express Afrique', 
  'Livraison Ouest Standard',
  'Livraison Ouest Express',
  'Livraison Ouest Économique',
  'Livraison Centrale Standard',
  'Livraison Centrale Express',
  'Livraison Nord Standard',
  'Livraison Nord Express',
  'Livraison Est Standard',
  'Livraison Est Express',
  'Livraison Australe Standard',
  'Livraison Australe Express'
);

-- 2. SUPPRIMER LES ZONES FACTICES
DELETE FROM public.shipping_zones 
WHERE name IN (
  'Afrique de l''Ouest',
  'Afrique Centrale', 
  'Afrique du Nord',
  'Afrique de l''Est',
  'Afrique Australe'
);

-- 3. VÉRIFICATION : AFFICHER CE QUI RESTE (VRAIES DONNÉES ADMIN)
SELECT 
  'Méthodes restantes (créées par admin)' as type,
  count(*) as count
FROM public.shipping_methods;

SELECT 
  'Zones restantes (créées par admin)' as type,
  count(*) as count  
FROM public.shipping_zones;

-- 4. AFFICHER LES VRAIES MÉTHODES DE L'ADMIN
SELECT 
  sm.id,
  sm.store_id,
  sm.name,
  sm.price,
  sm.estimated_days,
  sz.name as zone_name,
  sz.countries
FROM public.shipping_methods sm
LEFT JOIN public.shipping_zones sz ON sm.shipping_zone_id = sz.id
ORDER BY sm.store_id, sm.sort_order;

-- 5. SUPPRIMER LA FONCTION AUTOMATIQUE (PLUS BESOIN)
DROP FUNCTION IF EXISTS create_default_shipping_for_store(UUID);

-- FIN DU SCRIPT
-- Résultat attendu: Seulement les méthodes créées par l'admin restent
