import { supabase } from './supabase';

interface CachedData {
  pieces: Record<string, unknown>[];
  cats: string[];
  fetchedAt: number;
}

const TTL_MS = 5 * 60 * 1000; // 5 minutes

let cache: CachedData | null = null;

export async function fetchCatalogData(): Promise<{ pieces: Record<string, unknown>[]; cats: string[] }> {
  if (cache && Date.now() - cache.fetchedAt < TTL_MS) {
    return { pieces: cache.pieces, cats: cache.cats };
  }

  const [{ data: pData }, { data: cData }] = await Promise.all([
    supabase.from('products').select('*').eq('available', true).order('display_order'),
    supabase.from('categories').select('name').order('display_order'),
  ]);

  const pieces = pData ?? [];
  const cats = cData ? (cData as Record<string, string>[]).map(c => c.name) : [];

  cache = { pieces, cats, fetchedAt: Date.now() };
  return { pieces, cats };
}
