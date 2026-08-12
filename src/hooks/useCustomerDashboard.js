// hooks/useCustomerDashboard.js - Add polling for near real-time
import { useEffect, useState, useCallback, useRef } from 'react';
import { api } from '../services/api';

export function useCustomerDashboard() {
  const [state, setState] = useState({
    customerName: '', profileCompletion: 0,
    recentPros: [], conversations: [], notifications: [], favorites: [],
  });
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchPagination, setSearchPagination] = useState({ page: 1, pages: 1, total: 0, limit: 24 });
  const [lastSearchParams, setLastSearchParams] = useState(null);
  const [loading, setLoading] = useState({
    pros: true, conversations: true, notifications: true, favorites: true,
  });
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const activeViewRef = useRef('dashboard');

  const load = useCallback(async () => {
    try {
      const { data } = await api.getDashboard();
      setState(prev => ({ ...prev, ...data }));
      setError(null);
    } catch (err) { setError(err.message); }
    finally { setLoading({ pros: false, conversations: false, notifications: false, favorites: false }); }
  }, []);

  // ✅ Poll for new messages every 15 seconds
  useEffect(() => {
    load();
    intervalRef.current = setInterval(load, 15000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [load]);

  const DEFAULT_SEARCH_LIMIT = 24;

  const search = async (params) => {
    setIsSearching(true); setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (params.category) queryParams.append('category', params.category);
      if (params.state) queryParams.append('state', params.state);
      if (params.city) queryParams.append('city', params.city);
      queryParams.append('page', '1');
      queryParams.append('limit', String(DEFAULT_SEARCH_LIMIT));
      const { data, pagination } = await api.searchPros(queryParams.toString());
      setSearchResults(data || []);
      setSearchPagination(pagination || { page: 1, pages: 1, total: (data || []).length, limit: DEFAULT_SEARCH_LIMIT });
      setLastSearchParams(params);
      return data;
    } catch (err) { setError(err.message); return []; }
    finally { setIsSearching(false); }
  };

  const loadMoreResults = async () => {
    if (!lastSearchParams || loadingMore || searchPagination.page >= searchPagination.pages) return;
    setLoadingMore(true); setError(null);
    try {
      const nextPage = searchPagination.page + 1;
      const queryParams = new URLSearchParams();
      if (lastSearchParams.category) queryParams.append('category', lastSearchParams.category);
      if (lastSearchParams.state) queryParams.append('state', lastSearchParams.state);
      if (lastSearchParams.city) queryParams.append('city', lastSearchParams.city);
      queryParams.append('page', String(nextPage));
      queryParams.append('limit', String(searchPagination.limit || DEFAULT_SEARCH_LIMIT));
      const { data, pagination } = await api.searchPros(queryParams.toString());
      setSearchResults(prev => [...prev, ...(data || [])]);
      setSearchPagination(pagination || { ...searchPagination, page: nextPage });
    } catch (err) { setError(err.message); }
    finally { setLoadingMore(false); }
  };

  const sendMessage = async (proId, text) => {
    try {
      await api.sendMessage(proId, text);
      await load(); // ✅ Refresh immediately after sending
    } catch (err) { throw err; }
  };

  const markNotificationRead = async (n) => {
    try {
      await api.markNotificationRead(n.id);
      // ✅ Update local state immediately
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(notif => 
          notif.id === n.id ? { ...notif, read: true } : notif
        )
      }));
    } catch (err) { setError(err.message); }
  };

  const toggleFavorite = async (pro, next) => {
    try {
      await api.toggleFavorite(pro.id);
      await load();
    } catch (err) { setError(err.message); }
  };

  return {
    ...state, searchResults, isSearching, loadingMore, searchPagination, loading, error,
    refetch: load, search, loadMoreResults, sendMessage, markNotificationRead, toggleFavorite,
  };
}