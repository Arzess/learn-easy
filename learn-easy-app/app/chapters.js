import { createRxDatabase, addRxPlugin } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { getRxStorageSQLiteTrial } from 'rxdb/plugins/storage-sqlite';
import { Platform } from 'react-native';

const storage = Platform.OS === 'web' 
  ? getRxStorageDexie() 
  : getRxStorageSQLiteTrial();


const _create = async () => {
  const chapters_db = await createRxDatabase({
    name: 'learn-easy-db-chapters',
    storage: storage,
    ignoreDuplicate: true,
  })
await chapters_db.addCollections({
    chapters: {
      schema: {
        version: 0,
        primaryKey: 'number',
        type: 'object',
        properties: {
          number: { type: 'string', maxLength: 100 },
          title: { type: 'string' },
          inhalt: { type: 'string' }
        },
        required: ['number'],
      }
    },
    medias: {
      schema: {
        version: 0,
        primaryKey: 'mediaNumber',
        type: 'object',
        properties: {
          mediaNumber: {type: 'string', maxLength: 100},
          type: {
            type: 'string',
          },
          inhalt: {type: 'string'}
        },
        required: ['mediaNumber', 'type', 'inhalt'],
      }
    }
  });

  return chapters_db;
};