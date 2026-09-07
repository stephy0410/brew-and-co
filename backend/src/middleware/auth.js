const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

// Verifies the `Authorization: Bearer <token>` header and puts the user id
// on req.userId. Rejects with 401 when the token is missing or invalid.
function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Ensures the :<param> in the route matches the authenticated user, so a user
// can only read/modify their own resources (blocks IDOR on /user/:id etc).
function requireSelf(param) {
  return (req, res, next) => {
    if (String(req.params[param]) !== String(req.userId)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    return next();
  };
}

module.exports = { auth, requireSelf };
