// hooks/useCustomerDashboard.js
import { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';

export function useCustomerDashboard() {
  const [state, setState] = useState({
    customerName: '',
    profileCompletion: 0,
    recentPros: [],
    conversations: [],
    notifications: [],
    favorites: [],
  });
  
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [loading, setLoading] = useState({
    pros: true,
    conversations: true,
    notifications: true,
    favorites: true,
  });
  
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading({ pros: true, conversations: true, notifications: true, favorites: true });
      const { data } = await api.getDashboard();
      setState(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading({ pros: false, conversations: false, notifications: false, favorites: false });
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const search = async (params) => {
    setIsSearching(true);
    setError(null);
    try {
      const queryParams = {};
      if (params.category) queryParams.category = params.category;
      if (params.state) queryParams.state = params.state;
      if (params.city) queryParams.city = params.city;
      
      const { data } = await api.searchPros(queryParams);
      setSearchResults(data || []);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setIsSearching(false);
    }
  };

  return {
    ...state,
    searchResults,
    isSearching,
    loading,
    error,
    refetch: load,
    search,
    toggleFavorite: async (pro, next) => {
      try {
        await api.toggleFavorite(pro.id);
        await load();
      } catch (err) { setError(err.message); }
    },
    markNotificationRead: async (n) => {
      try {
        await api.markNotificationRead(n.id);
        await load();
      } catch (err) { setError(err.message); }
    },
    sendMessage: async (proId, text) => {
      try { await api.sendMessage(proId, text); } 
      catch (err) { setError(err.message); }
    },
  };
}