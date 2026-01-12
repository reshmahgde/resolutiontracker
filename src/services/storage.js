import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  GOALS: 'goals',
  UPDATES: 'updates',
  SETTINGS: 'settings',
};

export const getCurrentYear = () => {
  return new Date().getFullYear();
};

export const getGoalsForYear = async (year) => {
  try {
    const data = await AsyncStorage.getItem(`${STORAGE_KEYS.GOALS}_${year}`);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting goals:', error);
    return [];
  }
};

export const saveGoalsForYear = async (year, goals) => {
  try {
    await AsyncStorage.setItem(`${STORAGE_KEYS.GOALS}_${year}`, JSON.stringify(goals));
    return true;
  } catch (error) {
    console.error('Error saving goals:', error);
    return false;
  }
};

export const getUpdatesForYear = async (year) => {
  try {
    const data = await AsyncStorage.getItem(`${STORAGE_KEYS.UPDATES}_${year}`);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting updates:', error);
    return [];
  }
};

export const saveUpdatesForYear = async (year, updates) => {
  try {
    await AsyncStorage.setItem(`${STORAGE_KEYS.UPDATES}_${year}`, JSON.stringify(updates));
    return true;
  } catch (error) {
    console.error('Error saving updates:', error);
    return false;
  }
};

export const getAllYears = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const goalKeys = keys.filter(key => key.startsWith(`${STORAGE_KEYS.GOALS}_`));
    return goalKeys.map(key => parseInt(key.split('_')[1])).sort((a, b) => b - a);
  } catch (error) {
    console.error('Error getting years:', error);
    return [];
  }
};

