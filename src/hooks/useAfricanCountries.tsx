import { useQuery } from '@tanstack/react-query';
import { marketsShippingService } from '@/services/marketsShippingService';

export const useAfricanCountries = () => {
  const {
    data: countries = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['african-countries'],
    queryFn: () => marketsShippingService.getAfricanCountries(),
    staleTime: 1000 * 60 * 60, // 1 heure - les pays ne changent pas souvent
  });

  return {
    countries,
    isLoading,
    error
  };
};
