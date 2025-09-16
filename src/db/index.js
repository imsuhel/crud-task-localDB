import {addPouchPlugin, getRxStoragePouch} from 'rxdb/plugins/pouchdb';
import {addRxPlugin, createRxDatabase} from 'rxdb';
import {articleSchema, businessSchema} from './schemas';
import {setActive, setError, setLast, setOnline} from './replicationState';

import {AppState} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import PouchAdapterSQLite from 'pouchdb-adapter-react-native-sqlite';
import {deviceId} from './util';
import {replicateRxCollection} from 'rxdb/plugins/replication-couchdb';
import {v4 as uuidv4} from 'uuid';

addPouchPlugin(PouchAdapterSQLite);

let dbInstance = null;
let replications = [];

export async function initDB() {
  if (dbInstance) return dbInstance;

  const storage = getRxStoragePouch('react-native-sqlite');

  const db = await createRxDatabase({
    name: 'appdb',
    storage,
    multiInstance: false,
    eventReduce: true,
  });

  await db.addCollections({
    businesses: {schema: businessSchema},
    articles: {schema: articleSchema},
  });

  dbInstance = db;
  return db;
}

function couchUrl() {
  try {
    // Lazy require to avoid bundler issues if no .env
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const {COUCHDB_URL} = require('../../src/env');
    return COUCHDB_URL;
  } catch (e) {
    try {
      const {COUCHDB_URL} = require('@env');
      return COUCHDB_URL;
    } catch (err) {
      return '';
    }
  }
}

export async function startReplication(couchConfig = {}) {
  const db = dbInstance || (await initDB());
  const base = couchConfig.url || couchUrl();
  if (!base) return;

  stopReplication();

  const common = {
    live: true,
    retry: true,
    waitForLeadership: false,
  };

  const businesses = replicateRxCollection({
    collection: db.businesses,
    url: `${base.replace(/\/$/, '')}/businesses`,
    ...common,
    push: {
      async handler(docs) {
        const enriched = docs.map(d => ({
          ...d,
          updatedAt: d.updatedAt || Date.now(),
          deviceId: d.deviceId || deviceId(),
        }));
        return enriched;
      },
      batchSize: 100,
    },
    pull: {
      batchSize: 100,
    },
  });

  const articles = replicateRxCollection({
    collection: db.articles,
    url: `${base.replace(/\/$/, '')}/articles`,
    ...common,
    push: {
      async handler(docs) {
        const enriched = docs.map(d => ({
          ...d,
          updatedAt: d.updatedAt || Date.now(),
          deviceId: d.deviceId || deviceId(),
        }));
        return enriched;
      },
      batchSize: 100,
    },
    pull: {
      batchSize: 100,
    },
  });

  replications = [businesses, articles];

  const netSub = NetInfo.addEventListener(state => {
    const online = Boolean(state.isConnected);
    setOnline(online);
    replications.forEach(rep => {
      if (online) rep.resume();
      else rep.pause();
    });
  });

  // Resume when app foregrounds
  const appStateSub = AppState.addEventListener('change', next => {
    if (next === 'active') replications.forEach(r => r.resume());
  });

  replications.cleanup = () => {
    netSub && netSub();
    appStateSub && appStateSub.remove && appStateSub.remove();
  };

  const track = rep => {
    rep?.states?.forEach(st => {
      st.active$.subscribe(a => setActive(a));
      st.error$.subscribe(e => setError(e || null));
      st.down.ok$.subscribe(() => setLast(Date.now()));
      st.up.ok$.subscribe(() => setLast(Date.now()));
    });
  };
  [businesses, articles].forEach(track);

  return replications;
}

export function stopReplication() {
  if (!replications || replications.length === 0) return;
  replications.forEach(r => r.cancel());
  if (replications.cleanup) replications.cleanup();
  replications = [];
}

export function getDB() {
  return dbInstance;
}
