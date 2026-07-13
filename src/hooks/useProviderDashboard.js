// hooks/useProviderDashboard.js
import { useEffect, useState, useCallback } from 'react';
import { api } from '../services/providerApi';

export function useProviderDashboard() {
  const [state, setState] = useState({
    providerName: '',
    companyName: '',
    profileCompletion: 0,
    activeJobs: [],
    completedJobs: [],
    recentMessages: [],
    notifications: [],
    stats: {
      totalJobs: 0,
      rating: 0,
      reviews: 0,
      responseRate: 0
    }
  });
  
  const [loading, setLoading] = useState({
    dashboard: true,
    jobs: true,
    messages: true,
    notifications: true
  });
  
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(prev => ({
        ...prev,
        dashboard: true,
        jobs: true,
        messages: true,
        notifications: true
      }));
      
      const { data } = await api.getDashboard();
      setState(prev => ({ ...prev, ...data }));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading({
        dashboard: false,
        jobs: false,
        messages: false,
        notifications: false
      });
    }
  }, []);

  useEffect(() => { 
    load(); 
  }, [load]);

  const updateAvailability = async (isAvailable) => {
    try {
      await api.updateAvailability(isAvailable);
      await load(); // Reload dashboard data
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      
      // Determine which endpoint to call based on the section
      if (profileData.section === 'basic') {
        await api.updateBasicInfo(profileData.data);
      } else if (profileData.section === 'business') {
        await api.updateBusinessInfo(profileData.data);
      } else if (profileData.section === 'social') {
        await api.updateSocialLinks(profileData.data);
      } else {
        // Default to general update
        await api.updateProfile(profileData.data || profileData);
      }
      
      // Reload dashboard to reflect changes
      await load();
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const respondToJob = async (jobId, response) => {
    try {
      await api.respondToJob(jobId, response);
      await load();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    ...state,
    loading,
    error,
    refetch: load,
    updateAvailability,
    updateProfile,
    respondToJob
  };
}