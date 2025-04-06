/**
 * Middleware to protect routes by requiring a valid JWT in the Authorization header.
 *
 * - Expected header format: "Authorization: Bearer <token>"
 * - Verifies token and attaches the user ID to req.userId
 * - Responds with 401 if token is missing, invalid, or expired
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {Function} next - Function to call the next middleware
 */
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for presence of Authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  // Extract token from header
  const token = authHeader.split(' ')[1];

  try {
    // Verify token using secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user ID from token to the request object
    req.userId = decoded.id;
    // Proceed to next middleware/route
    next();
  } catch (err) {
    // Token is invalid or expired
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
