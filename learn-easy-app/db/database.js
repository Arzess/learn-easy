import { createRxDatabase, addRxPlugin } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { getRxStorageSQLite } from 'rxdb/plugins/storage-sqlite';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { Platform } from 'react-native';

const storage = Platform.OS === 'web' 
  ? getRxStorageDexie() 
  : getRxStorageSQLite();


const _create = async () => {
  if (process.env.NODE_ENV === 'development') {
    addRxPlugin(RxDBDevModePlugin);
  }
  const db = await createRxDatabase({
    name: 'learn-easy-db',
    storage: wrappedValidateAjvStorage({
        storage: storage,
    }),
    ignoreDuplicate: true,
  });

  await db.addCollections({
    user: {
      schema: {
        version: 0,
        primaryKey: 'id',
        type: 'object',
        properties: {
          id: { type: 'string', maxLength: 100 },
          current: { type: 'boolean' },
          intensity: { type: 'string' },
          role: { type: 'string' },
          name: { type: 'string' },
          username: { type: 'string' },
          course: { type: 'string' },
          courseHistory: { 
            type: 'array', 
            items: { type: 'string' } 
          },
          currentChapter: {
            type: 'integer',
          },
          currentCourseCompletedChapters: { 
            type: 'array', 
            items: { type: 'string' } 
          }
        },
        required: ['id', 'current', 'intensity', 'role', 'name', 'username', 'course', 'courseHistory', 'currentChapter', 'currentCourseCompletedChapters'],
      }
    },
    bookmarks: {
      schema: {
          version: 0,
          primaryKey: 'bookmarkId',
          type: 'object',
          properties: {
            bookmarkId: { type: 'string', maxLength: 100 },
            inhaltsTyp: { type: 'string' },
            inhaltsId: { type: 'number' }, 
          },
          required: ['bookmarkId', 'inhaltsTyp', 'inhaltsId'],
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


