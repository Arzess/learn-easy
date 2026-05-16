import { createRxDatabase, addRxPlugin } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { getRxStorageLoki } from 'rxdb/plugins/storage-lokijs';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { Platform } from 'react-native';

const getLokiAdapter = () => {
  if (Platform.OS !== 'web') {
    const LokiAsyncStorageAdapter = require('loki-async-reference-adapter');
    return LokiAsyncStorageAdapter();
  }
  return null;
};

const getStorage = () => {
  if (Platform.OS === 'web') {
    return getRxStorageDexie();
  }
  return getRxStorageLoki({
    adapter: getLokiAdapter(),
  });
};


export let bookmarkCounter = 1;

 // Bookmark logic
 // Add a bookmark
export const addBookmark = async (db, content_id, type) => {
  if (db){
    db.general.bookmarks.upsert({
      bookmarkId: String(bookmarkCounter),
      inhaltsTyp: type,
      inhaltsId: content_id,
    })
    bookmarkCounter++;
  }
 }
 export const removeBookmark = async (db, content_id) => {
  if (db){
   // @ts-ignore
   const bookmark = await db.general.bookmarks.findOne({
     selector: { inhaltsId: {$eq: content_id}}
   }).exec();
   if (bookmark) await bookmark.remove();
  }

 }


const _create = async () => {
  if (process.env.NODE_ENV === 'development') {
    addRxPlugin(RxDBDevModePlugin);
  }
  const db = await createRxDatabase({
    name: 'learn-easy-db',
    storage: wrappedValidateAjvStorage({
        storage: getStorage(),
    }),
    multiInstance: false,
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


