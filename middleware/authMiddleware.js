const jwt = require('jsonwebtoken');

/**
 * Middleware function to verify JWT token from Authorization header.
 * If token is valid, decodes and attaches userId to req object.
 * If token is invalid or missing, sends a 401 Unauthorized response.
 * @param {object} req - Request object from express.
 * @param {object} res - Response object from express.
 * @param {function} next - The next middleware function.
 */
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, no token found' });
  }

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized, token failed' });
    }
    req.userId = decoded.userId;
    next();
  });
}

module.exports = {
  verifyToken,
};