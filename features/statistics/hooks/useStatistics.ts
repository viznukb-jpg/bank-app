import { useQuery } from '@tanstack/react-query';
import { WORKER_INTERVAL_MS } from '@/shared/config/constants';
import type { Statistics } from '@/shared/types';

export function useStatistics() {
  return useQuery<Statistics>({
    queryKey: ['statistics'],
    queryFn: async () => {
      const res = await fetch('/api/statistics');
      if (!res.ok) throw new Error('Failed to fetch statistics');
      return res.json();
    },
    refetchInterval: WORKER_INTERVAL_MS,
  });
}
