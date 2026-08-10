// hooks/useLocations.js
//
// Nigerian states -> LGA/city data, fetched once from the backend (the
// single source of truth also used for server-side validation) and cached
// in sessionStorage so repeat mounts across the app don't refetch.
import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://service-server-e64r.onrender.com/api';
const CACHE_KEY = 'nigeria_locations_v1';

let memoryCache = null;

function readCache() {
  if (memoryCache) return memoryCache;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (raw) {
      memoryCache = JSON.parse(raw);
      return memoryCache;
    }
  } catch {
    // sessionStorage unavailable (private mode, etc.) - fall through to fetch
  }
  return null;
}

function writeCache(data) {
  memoryCache = data;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota/availability errors - in-memory cache still works for this session
  }
}

export function useLocations() {
  const [locations, setLocations] = useState(() => readCache() || {});
  const [loading, setLoading] = useState(() => !readCache());

  useEffect(() => {
    if (readCache()) return;

    let cancelled = false;
    fetch(`${API_URL}/locations/all`)
      .then((res) => res.json())
      .then((result) => {
        if (cancelled) return;
        const data = result.data || {};
        writeCache(data);
        setLocations(data);
      })
      .catch(() => {
        // Leave locations empty; dropdowns will just show no options rather than crash.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    locations, // { [state]: string[] lgas }
    states: Object.keys(locations),
    getLgas: (state) => locations[state] || [],
    loading,
  };
}
