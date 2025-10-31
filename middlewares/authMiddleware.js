import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  let token = null;

  if (header && header.startsWith('Bearer ')) {
    token = header.split(' ')[1];
    console.log(token);
  } else if (req.cookies && req.cookies.token) {
    // Accept token from cookie as well (frontend may store it in cookie)
    token = req.cookies.token;
  }

  if (!token) return res.status(401).json({ error: 'Not authorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
    const user = await User.findById(decoded.id).select('-password');
     console.log(user);
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    req.user = user;
    next();
  } catch (err) {
      console.error("JWT Error:", err.message);
    return res.status(401).json({ error: 'Not authorized' });
  }
};





















