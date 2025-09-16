let COUCHDB_URL = '';
try {
  const env = require('@env');
  COUCHDB_URL = env.COUCHDB_URL || '';
} catch (e) {
  try {
    // fallback for metro when dotenv plugin not enabled
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const local = require('../env.local');
    COUCHDB_URL = local.COUCHDB_URL || '';
  } catch (e2) {}
}

module.exports = {COUCHDB_URL};
