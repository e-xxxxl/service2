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

  const search = async (params) => {
    setIsSearching(true); setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (params.category) queryParams.append('category', params.category);
      if (params.state) queryParams.append('state', params.state);
      if (params.city) queryParams.append('city', params.city);
      const { data } = await api.searchPros(queryParams.toString());
      setSearchResults(data || []);
      return data;
    } catch (err) { setError(err.message); return []; }
    finally { setIsSearching(false); }
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
    ...state, searchResults, isSearching, loading, error,
    refetch: load, search, sendMessage, markNotificationRead, toggleFavorite,
  };
}