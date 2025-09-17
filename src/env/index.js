// Default configuration
const defaultConfig = {
  COUCHDB_URL: 'http://localhost:5984',
  COUCHDB_USER: 'admin',
  COUCHDB_PASSWORD: 'password',
  COUCHDB_PORT: 5984,
};

let config = {...defaultConfig};

try {
  // Try to load from @env (react-native-dotenv)
  const env = require('@env');
  if (env) {
    config = {
      COUCHDB_URL: env.COUCHDB_URL || config.COUCHDB_URL,
      COUCHDB_USER: env.couchUSER || env.COUCHDB_USER || config.COUCHDB_USER,
      COUCHDB_PASSWORD: env.couchPASSWORD || env.COUCHDB_PASSWORD || config.COUCHDB_PASSWORD,
      COUCHDB_PORT: env.couchPORT || env.COUCHDB_PORT || config.COUCHDB_PORT,
    };
  }
} catch (e) {
  try {
    // Fallback to .env file
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const local = require('../.env');
    if (local) {
      config = {
        COUCHDB_URL: local.COUCHDB_URL || config.COUCHDB_URL,
        COUCHDB_USER: local.couchUSER || local.COUCHDB_USER || config.COUCHDB_USER,
        COUCHDB_PASSWORD: local.couchPASSWORD || local.COUCHDB_PASSWORD || config.COUCHDB_PASSWORD,
        COUCHDB_PORT: local.couchPORT || local.COUCHDB_PORT || config.COUCHDB_PORT,
      };
    }
  } catch (e2) {
    console.warn('Using default configuration. Could not load environment variables:', e2.message);
  }
}

// Construct URL if not provided
if (!config.COUCHDB_URL || config.COUCHDB_URL === defaultConfig.COUCHDB_URL) {
  const protocol = config.COUCHDB_PORT === 443 ? 'https' : 'http';
  const hostname = 'couchdb.up.railway.app';
  const port = [80, 443].includes(Number(config.COUCHDB_PORT)) ? '' : `:${config.COUCHDB_PORT}`;
  config.COUCHDB_URL = `${protocol}://${config.COUCHDB_USER}:${config.COUCHDB_PASSWORD}@${hostname}${port}`;
}

console.log('CouchDB Configuration:', {
  url: config.COUCHDB_URL.replace(/:([^/]*)@/, ':***@'), // Hide password in logs
  user: config.COUCHDB_USER,
  port: config.COUCHDB_PORT,
});

module.exports = config;
