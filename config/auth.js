const jwt = require('jsonwebtoken');

const secret = 'your_jwt_secret'; // Remplacez par votre propre clé secrète

const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '1h' });
};

const verifyToken = (token) => {
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken
};
