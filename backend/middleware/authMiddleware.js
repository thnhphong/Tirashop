import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for "Bearer token"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || '0e8K9b0bU5UAcsZb89CLnQ8OtTFTiATbC5AdHjhk2LU='
    );

    req.user = decoded; // attach user data to request
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
