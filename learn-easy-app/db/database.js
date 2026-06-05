import { createRxDatabase, addRxPlugin } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { Platform } from 'react-native';

// Wählt den richtigen Speicher-Adapter je nach Plattform.
// Auf Web wird IndexedDB (Dexie) verwendet, auf Android/iOS In-Memory-Speicher,
// da SQLite-basierte Lösungen in Expo Go nicht ohne weiteres verfügbar sind.
const getStorage = () => {
  if (Platform.OS === 'web') return getRxStorageDexie();
  return getRxStorageMemory();
};

// mit KI bearbeitet – eindeutige Bookmark-IDs mit Timestamp, RxDB Dev-Mode Plugin entfernt
export let bookmarkCounter = 1;

// Speichert einen neuen Bookmark in der Datenbank.
// Die ID wird aus content_id + aktuellem Timestamp zusammengesetzt,
// um Kollisionen nach App-Neustarts zu vermeiden.
// Parameter: db = Datenbankinstanz, content_id = ID des Inhalts,
// type = "text" | "image" | "video", url = Medien-URL oder Text
export const addBookmark = async (db, content_id, type, url) => {
  if (db){
    const bookmarkId = `${content_id}_${Date.now()}`;
    db.general.bookmarks.upsert({
      bookmarkId,
      inhaltsTyp: type,
      inhaltsId: content_id,
      url: url,
    })
    bookmarkCounter++;
  }
 }
// Sucht einen Bookmark anhand seiner bookmarkId und löscht ihn aus der Datenbank.
// Wird aufgerufen wenn der User das Bookmark-Icon ein zweites Mal antippt.
export const removeBookmark = async (db, bookmark_id) => {
  if (db){
   // @ts-ignore
   const bookmark = await db.general.bookmarks.findOne({
     selector: { bookmarkId: {$eq: bookmark_id}}
   }).exec();
   if (bookmark) await bookmark.remove();
  }

 }


// Erstellt die RxDB Datenbank mit drei Collections:
// - user: Speichert Profildaten, Kurs, Fortschritt und Einstellungen
// - bookmarks: Speichert gespeicherte Texte, Bilder und Videos
// - last_queries: Speichert frühere Suchanfragen
// AJV-Validierung stellt sicher dass nur valide Daten gespeichert werden.
const _create = async () => {
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
          completedCourses: {
            type: 'array',
            items: {type: 'string'}
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
            url: {type: 'string'}, 
          },
          required: ['bookmarkId', 'inhaltsTyp', 'inhaltsId', 'url'],
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

// Gibt die Datenbankinstanz zurück. Verwendet das Singleton-Muster:
// Die Datenbank wird nur beim ersten Aufruf erstellt, danach wird
// immer dieselbe Instanz zurückgegeben um mehrfache Initialisierung zu vermeiden.
export const getDatabase = () => {
  if (!dbPromise) {
    dbPromise = _create();
  }
  return dbPromise;
};


