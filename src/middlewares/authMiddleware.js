const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {


  try {
      const token = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ status: 'fail', message: 'Access denied. No token provided.' });
  }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY );
    req.user = decoded; // Add decoded token to request
    next();
  } catch (error) {
    return res.status(403).json({ status: 'fail', message: 'Invalid or expired token.' });
  }
}
 
module.exports = {authenticateToken  };
