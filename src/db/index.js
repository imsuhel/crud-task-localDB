import {AppState, Platform} from 'react-native';
import {addRxPlugin, createRxDatabase} from 'rxdb';
import {articleSchema, businessSchema} from './schemas';
import {setActive, setError, setLast, setOnline} from './replicationState';

import {Buffer} from 'buffer';
import NetInfo from '@react-native-community/netinfo';
// import {RxDBDevModePlugin} from 'rxdb/plugins/dev-mode';
import {RxDBQueryBuilderPlugin} from 'rxdb/plugins/query-builder';
import {RxDBUpdatePlugin} from 'rxdb/plugins/update';
import {deviceId} from './util';
import {getRxStorageSQLiteTrial} from 'rxdb/plugins/storage-sqlite';
import {getSQLiteBasicsQuickSQLite} from 'rxdb/plugins/storage-sqlite';
import {open as openQuickSQLite} from 'react-native-quick-sqlite';
import {replicateCouchDB} from 'rxdb/plugins/replication-couchdb';
import {sha256} from 'js-sha256';

// Enable RxDB dev mode for better error messages
// if (__DEV__) {
//   addRxPlugin(RxDBDevModePlugin);
// }

// Test CouchDB connection
async function testCouchDBConnection(url, auth) {
  try {
    const username = auth?.username || 'admin';
    const password = auth?.password || 'i4G7wPooiLHL';
    const authHeader = Buffer.from(`${username}:${password}`).toString(
      'base64',
    );

    // Ensure URL ends with a slash
    const baseUrl = url.endsWith('/') ? url : `${url}/`;

    // Test server info endpoint
    const serverInfoUrl = `${baseUrl}`;
    console.log('Testing CouchDB connection to:', serverInfoUrl);

    // 1. Test basic server connection
    const serverResponse = await fetch(serverInfoUrl, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${authHeader}`,
        Accept: 'application/json',
      },
      timeout: 10000,
    });

    if (!serverResponse.ok) {
      const errorText = await serverResponse.text();
      console.error('Server connection failed:', {
        status: serverResponse.status,
        statusText: serverResponse.statusText,
        error: errorText,
      });
      return false;
    }

    const serverInfo = await serverResponse.json();
    console.log('CouchDB server info:', {
      version: serverInfo.version,
      vendor: serverInfo.vendor,
      features: serverInfo.features || [],
    });

    // 2. Test database access
    const dbsUrl = `${baseUrl}_all_dbs`;
    const dbsResponse = await fetch(dbsUrl, {
      headers: {
        Authorization: `Basic ${authHeader}`,
        Accept: 'application/json',
      },
      timeout: 10000,
    });

    if (!dbsResponse.ok) {
      console.error('Database access test failed:', await dbsResponse.text());
      return false;
    }

    const databases = await dbsResponse.json();
    console.log('Available databases:', databases);

    // 3. Test if our required databases exist
    const requiredDbs = ['businesses', 'articles'];
    const missingDbs = requiredDbs.filter(db => !databases.includes(db));

    if (missingDbs.length > 0) {
      console.warn(
        `Warning: Missing required databases: ${missingDbs.join(', ')}`,
      );
      // Continue anyway, databases will be created on first sync
    }

    return true;
  } catch (error) {
    console.error('CouchDB connection test failed:', {
      message: error.message,
      name: error.name,
      code: error.code,
      type: error.type,
      url: error.url || url,
    });
    return false;
  }
}

let dbInstance = null;
let replications = [];
let initPromise = null;
// Create sqliteBasics once to keep the same creator identity across openings
const sqliteBasics = getSQLiteBasicsQuickSQLite(openQuickSQLite);
const hashFunction = async data =>
  sha256(typeof data === 'string' ? data : JSON.stringify(data));

export async function initDB() {
  // Add required plugins
  addRxPlugin(RxDBQueryBuilderPlugin);
  addRxPlugin(RxDBUpdatePlugin);

  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  // Ensure any previous instance is cleaned up and previous DB files are removed
  try {
    if (dbInstance && typeof dbInstance.destroy === 'function') {
      await dbInstance.destroy();
      dbInstance = null;
    }
  } catch (_) {}

  try {
    if (typeof openQuickSQLite?.delete === 'function') {
      // Delete both possible filenames used by RxDB SQLite Trial
      await openQuickSQLite.delete('appdb_qs_trial');
      await openQuickSQLite.delete('_trial_appdb_qs_trial');
      console.warn(
        '[DB] Deleted stale SQLite files to resolve creator mismatch',
      );
    }
  } catch (e) {
    console.warn(
      '[DB] Delete attempt failed (safe to ignore if first run):',
      e?.message || e,
    );
  }

  const storage = getRxStorageSQLiteTrial({sqliteBasics});

  initPromise = (async () => {
    const db = await createRxDatabase({
      name: 'appdb_qs_trial_2',
      storage,
      multiInstance: false,
      eventReduce: true,
      hashFunction,
    });
    await db.addCollections({
      businesses: {schema: businessSchema},
      articles: {schema: articleSchema},
    });
    dbInstance = db;
    initPromise = null;
    return db;
  })();

  return initPromise;
}

export async function getOrInitDB(pref) {
  if (pref) return pref;
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  return initDB();
}

// Get CouchDB configuration from environment
function getCouchConfig() {
  try {
    console.log('Loading environment configuration...');
    const config = require('../env');

    if (!config.COUCHDB_URL) {
      console.warn('COUCHDB_URL is not defined in environment');
    }

    return {
      url: config.COUCHDB_URL,
      auth: {
        username: config.COUCHDB_USER || 'admin',
        password: config.COUCHDB_PASSWORD || '',
      },
      port: config.COUCHDB_PORT || 5984,
    };
  } catch (e) {
    console.warn('Error loading CouchDB configuration:', e);
    return null;
  }
}

/**
 * Starts bi-directional replication with CouchDB
 * @param {Object} couchConfig - Configuration object
 * @param {string} [couchConfig.url] - CouchDB URL (e.g., http://user:pass@localhost:5984)
 * @param {boolean} [couchConfig.live=true] - Enable live replication
 * @param {boolean} [couchConfig.retry=true] - Auto-retry failed replications
 */

export async function startReplication(couchConfig = {}) {
  try {
    console.log('Starting replication...');
    const db = await getOrInitDB();
    const config = getCouchConfig();
    if (!config) {
      const errorMsg = 'No CouchDB configuration found';
      console.error(errorMsg);
      setError(errorMsg);
      return null;
    }

    const common = {
      live: couchConfig.live !== false, // default true
      retry: couchConfig.retry !== false, // default true
      waitForLeadership: false,
      headers: {
        'User-Agent': 'crudTask-mobile-app',
      },
      options: {
        live: true,
        retry: true,
        back_off_function: delay => {
          if (delay === 0) return 1000; // start with 1s delay
          return Math.min(delay * 2, 30000); // max 30s delay
        },
      },
    };

    console.log(common, 'common');

    console.log('Starting replication for businesses collection');
    // Configure businesses collection replication
    const businesses = replicateCouchDB({
      collection: db.businesses,
      url: 'https://database-production-b3e6.up.railway.app/businesses',
      // name: 'businesses',
      auth: {
        username: 'admin',
        password: 'i4G7wPooiLHL',
      },
      // database: 'businesses',
      push: {
        batchSize: 100,
        modifier: d => d,
      },
      pull: {
        batchSize: 100,
        filter: '_view',
        view: 'all',
        query_params: {include_docs: true},
      },
      live: true,
      retry: true,
      back_off_function: delay => Math.min(delay * 2, 30000),
      fetch: (url, opts) => {
        console.log('Fetching:', url);
        return fetch(url, {
          ...opts,
          headers: {
            ...opts.headers,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 second timeout
        }).catch(err => {
          console.error('Fetch error:', err);
          throw err;
        });
      },
      ...common,
      // Add replication state handlers
      sync: {
        on: {
          active: () => {
            console.log('Businesses replication is now active');
            setActive(true, 'businesses');
          },
          denied: err => {
            console.error('Businesses replication denied:', {
              message: err.message,
              status: err.status,
              name: err.name,
              stack: err.stack,
            });
            setError('Sync permission denied');
          },
          error: err => {
            console.error('Businesses replication error:', {
              message: err.message,
              status: err.status,
              name: err.name,
              stack: err.stack,
            });
            setError('Sync error occurred');
          },
          complete: info => {
            console.log('Businesses replication completed:', {
              docs_written: info.docs_written,
              docs_read: info.docs_read,
              doc_write_failures: info.doc_write_failures,
              errors: info.errors,
            });
            setLast(new Date().toISOString(), 'businesses');
          },
        },
      },
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

    console.log('ended for bussiness');

    // Replicate articles collection
    console.log('Starting replication for articles collection');
    // Configure articles collection replication
    const articles = replicateCouchDB({
      collection: db.articles,
      url: 'https://database-production-b3e6.up.railway.app/articles',
      // name: 'articles',
      auth: {
        username: 'admin',
        password: 'i4G7wPooiLHL',
      },
      // database: 'articles',
      push: {
        batchSize: 100,
        modifier: d => d,
      },
      pull: {
        batchSize: 100,
        filter: '_view',
        view: 'all',
        query_params: {include_docs: true},
      },
      live: true,
      retry: true,
      back_off_function: delay => Math.min(delay * 2, 30000),
      fetch: (url, opts) => {
        console.log('Fetching:', url);
        return fetch(url, {
          ...opts,
          headers: {
            ...opts.headers,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 second timeout
        }).catch(err => {
          console.error('Fetch error:', err);
          throw err;
        });
      },
      ...common,
      // Add replication state handlers
      sync: {
        on: {
          active: () => setActive(true, 'articles'),
          denied: err => {
            console.error('Articles replication denied:', err);
            setError('Sync permission denied');
          },
          error: err => {
            console.error('Articles replication error:', err);
            setError('Sync error occurred');
          },
          complete: info => setLast(new Date().toISOString(), 'articles'),
        },
      },
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
  } catch (error) {
    console.error('Replication error:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
      parameters: error.parameters,
    });

    // Check if it's an authentication error
    if (
      error.message &&
      (error.message.includes('unauthorized') ||
        error.message.includes('authentication') ||
        error.message.includes('forbidden'))
    ) {
      setError('Authentication failed. Please check your CouchDB credentials.');
    } else if (
      error.message &&
      error.message.includes('database does not exist')
    ) {
      setError(
        'The specified database does not exist. Please create it first.',
      );
    } else if (error.message && error.message.includes('ECONNREFUSED')) {
      setError(
        'Connection refused. Please check if the CouchDB server is running and accessible.',
      );
    } else {
      setError(`Replication error: ${error.message || 'Unknown error'}`);
    }
  }
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
