import { PhysioRecord } from '../types';

const STORAGE_KEY = 'physio_prontuario_records_v1';

export const getRecords = (): PhysioRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Failed to load records", error);
    return [];
  }
};

export const saveRecords = (records: PhysioRecord[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error("Failed to save records", error);
  }
};