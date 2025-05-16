import admin from 'firebase-admin';
import jwt from 'jsonwebtoken';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // First try to verify as a Firebase token
    try {
      // If Firebase admin is properly initialized
      if (admin.apps.length) {
        const decodedFirebase = await admin.auth().verifyIdToken(token);
        req.user = {
          uid: decodedFirebase.uid,
          email: decodedFirebase.email,
          name: decodedFirebase.name || decodedFirebase.email?.split('@')[0]
        };
        return next();
      }
    } catch (firebaseError) {
      console.log('Not a valid Firebase token, trying JWT');
    }

    // If not a Firebase token or Firebase admin not initialized, try as JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).json({ message: 'Invalid token.' });
  }
};
