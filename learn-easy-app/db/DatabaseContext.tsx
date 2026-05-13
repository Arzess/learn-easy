import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { RxDatabase } from 'rxdb';
import { getAllDatabases } from './database-index';

const DatabaseContext = createContext<DBRegistry | null>(null);

interface DBRegistry {
  general: RxDatabase;
}

export const DatabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [dbs, setDbs] = useState<DBRegistry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const result = await getAllDatabases(); //
        if (mounted) setDbs(result);
      } catch (err) {
        console.error("Failed to init DB:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  return (
    <DatabaseContext.Provider value={dbs}>
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        children
      )}
    </DatabaseContext.Provider>
  );
};

export const useDB = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDB must be used within a DatabaseProvider");
  }
  return context;
};