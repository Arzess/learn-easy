import { getChaptersDatabase } from './chapters';
import { getGeneralDatabase } from './database';

export const getAllDatabases = async () => {
  const [chapters, general] = await Promise.all([
    getChaptersDatabase(),
    getGeneralDatabase()
  ]);

  return { chapters, general };
};