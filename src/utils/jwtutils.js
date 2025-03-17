const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'jouw_geheime_sleutel'; // Zorg dat je een veilige sleutel in .env hebt

// Genereer een JWT-token voor een gebruiker
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email }, // Payload (inhoud van de token)
    SECRET_KEY, // Geheime sleutel
    { expiresIn: '2h' } // Token vervalt na 2 uur
  );
};

// Verifieer een JWT-token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null; // Ongeldige token
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
