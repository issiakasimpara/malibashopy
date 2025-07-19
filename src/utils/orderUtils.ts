// Utilitaires pour les commandes

export function getOrderStatusBadge(status: string) {
  const statusConfig = {
    pending: { label: 'En attente', variant: 'secondary' as const },
    confirmed: { label: 'Confirmée', variant: 'default' as const },
    shipped: { label: 'Expédiée', variant: 'default' as const },
    delivered: { label: 'Livrée', variant: 'default' as const },
    cancelled: { label: 'Annulée', variant: 'destructive' as const },
  };

  return statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const };
}

export function getPaymentStatusBadge(status: string) {
  const statusConfig = {
    pending: { label: 'En attente', variant: 'secondary' as const },
    paid: { label: 'Payé', variant: 'default' as const },
    failed: { label: 'Échec', variant: 'destructive' as const },
    refunded: { label: 'Remboursé', variant: 'outline' as const },
  };

  return statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const };
}

export function formatCurrency(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount);
}
