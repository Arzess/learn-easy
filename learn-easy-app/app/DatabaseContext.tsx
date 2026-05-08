import React, { createContext, useContext, useEffect, useState } from 'react';
import { RxDatabase } from 'rxdb';
import { getAllDatabases } from './database-index';

const DatabaseContext = createContext<DBRegistry | null>(null);

interface DBRegistry {
  chapters: RxDatabase;
  general: RxDatabase;
}

export const DatabaseProvider = ({ children } : { children: React.ReactNode }) => {
  const [dbs, setDbs] = useState<DBRegistry | null>(null);

  useEffect(() => {
    const init = async () => {
      const result = await getAllDatabases();
      setDbs(result);
    };
    init();
  }, []);

  return (
    <DatabaseContext.Provider value={dbs}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDB = () => useContext(DatabaseContext);