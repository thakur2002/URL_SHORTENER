
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'../.env'});
const authmiddleware = (req, res, next) => {
    
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token,process.env.Secret);
    req.user = decoded;
    
    next();
  } catch (e) {
    return res.status(401).json({ error: e.message });
  }
};

module.exports = authmiddleware;
