import { getDatabase } from './database';

export const getAllDatabases = async () => {
  try {
    const general = await getDatabase();
    if (!general || !general.user) {
      throw new Error("Database or 'user' collection missing");
    }
    return { general };
  } catch (e) {
    console.error("getAllDatabases Error:", e);
    throw e;
  }
};