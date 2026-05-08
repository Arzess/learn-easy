import { createRxDatabase, addRxPlugin } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { getRxStorageSQLite } from 'rxdb/plugins/storage-sqlite';
import { Platform } from 'react-native';

const storage = Platform.OS === 'web' 
  ? getRxStorageDexie() 
  : getRxStorageSQLite();


const _create = async () => {
  const db = await createRxDatabase({
    name: 'learn-easy-db',
    storage: storage,
    ignoreDuplicate: true,
  })
await db.addCollections({
    user: {
      schema: {
        version: 0,
        primaryKey: 'id',
        type: 'object',
        properties: {
          id: { type: 'string', maxLength: 100 },
          intensity: {type: 'string'},
          role: {type: 'string'},
          name: { type: 'string' },
          email: {type: 'string'},
          completedIntroduction: {type: 'boolean', default: 'false'},
          
        },
        required: ['id', 'intensity', 'role', 'name', 'email',],
      }
    },
    bookmarks: {
      schema: {
          version: 0,
          primaryKey: 'bookmarkId',
          type: 'object',
          properties: {
            bookmarkId: { type: 'string', maxLength: 100 },
            isInhalt: {type: 'boolean'},
            inhaltsId: {type: 'integer'},
          },
         required: ['bookmarkId', 'isInhalt', 'inhaltsId'],
      }
    },
    last_queries: {
        schema: {
          version: 0,
          primaryKey: 'id',
          type: 'object',
          properties: {
            id: { type: 'string', maxLength: 100 },
            query: { type: 'string' }
          },
         required: ['id', 'query'],
      }
    },
  });

  return db;
};

let dbPromise = null;

export const getDatabase = () => {
  if (!dbPromise) {
    dbPromise = _create();
  }
  return dbPromise;
};