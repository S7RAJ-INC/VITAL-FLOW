import { useState, useCallback } from 'react';
import { getCheckIns, CheckIn } from '../utils/storage';

/**
 * Custom hook for managing check-in data
 * Provides functions to fetch, filter, and calculate statistics
 */
export const useCheckInData = () => {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCheckIns = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getCheckIns();
      setCheckIns(data);
    } catch (error) {
      console.error('Error loading check-ins:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTodayCheckIn = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return checkIns.find(ci => ci.date === today) || null;
  }, [checkIns]);

  const getAverageMood = useCallback(() => {
    if (checkIns.length === 0) return 0;
    const sum = checkIns.reduce((acc, ci) => acc + ci.mood, 0);
    return (sum / checkIns.length).toFixed(1);
  }, [checkIns]);

  const getMoodTrend = useCallback((days: number = 7) => {
    return checkIns.slice(0, days);
  }, [checkIns]);

  return {
    checkIns,
    isLoading,
    loadCheckIns,
    getTodayCheckIn,
    getAverageMood,
    getMoodTrend,
  };
};
