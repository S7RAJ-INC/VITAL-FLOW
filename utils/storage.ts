import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  CHECK_INS: 'check_ins',
  ONBOARDING_COMPLETED: 'onboarding_completed',
};

export interface UserProfile {
  name: string;
  age: number;
  goal: string;
  createdAt: string;
}

export interface CheckIn {
  id: string;
  date: string;
  mood: number; // 1-10
  journal: string;
  symptoms?: string[];
  aiInsight?: string;
  timestamp: number;
}

// User Profile Functions
export const saveUserProfile = async (profile: UserProfile) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const profile = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Check-in Functions
export const saveCheckIn = async (checkIn: CheckIn) => {
  try {
    const existing = await getCheckIns();
    const updated = [checkIn, ...existing];
    await AsyncStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving check-in:', error);
    throw error;
  }
};

export const getCheckIns = async (): Promise<CheckIn[]> => {
  try {
    const checkIns = await AsyncStorage.getItem(STORAGE_KEYS.CHECK_INS);
    return checkIns ? JSON.parse(checkIns) : [];
  } catch (error) {
    console.error('Error getting check-ins:', error);
    return [];
  }
};

export const getTodayCheckIn = async (): Promise<CheckIn | null> => {
  try {
    const checkIns = await getCheckIns();
    const today = new Date().toISOString().split('T')[0];
    return checkIns.find(ci => ci.date === today) || null;
  } catch (error) {
    console.error('Error getting today check-in:', error);
    return null;
  }
};

export const deleteCheckIn = async (id: string) => {
  try {
    const existing = await getCheckIns();
    const updated = existing.filter(ci => ci.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(updated));
  } catch (error) {
    console.error('Error deleting check-in:', error);
    throw error;
  }
};

// Onboarding Functions
export const markOnboardingComplete = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
  } catch (error) {
    console.error('Error marking onboarding complete:', error);
    throw error;
  }
};

export const isOnboardingComplete = async (): Promise<boolean> => {
  try {
    const completed = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return completed === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_PROFILE,
      STORAGE_KEYS.CHECK_INS,
      STORAGE_KEYS.ONBOARDING_COMPLETED,
    ]);
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};
