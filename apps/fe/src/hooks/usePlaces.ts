import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Place } from '@/types/place';

// Server state (TanStack Query) — PRD §18.2. RLS scopes rows to the current
// user automatically (§19.3), so no explicit owner filter is needed here.
//
// NOTE: DB columns are snake_case; a row→Place camelCase mapper is a TODO for
// when the registration/detail screens land. For now rows are returned as-is.

export function usePlaces() {
  return useQuery({
    queryKey: ['places'],
    queryFn: async (): Promise<Place[]> => {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Place[];
    },
  });
}
