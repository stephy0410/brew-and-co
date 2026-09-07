// Central place for auth-related config. Fail fast in production if the
// signing secret is missing so we never fall back to a known dev value.
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable must be set in production');
}

module.exports = {
  JWT_SECRET: JWT_SECRET || 'dev-only-insecure-secret-change-me',
  JWT_EXPIRES_IN: '7d',
};
