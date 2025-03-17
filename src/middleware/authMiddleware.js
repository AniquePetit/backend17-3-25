import jwt from 'jsonwebtoken';

// Haal de geheime sleutel uit omgevingsvariabelen
const SECRET_KEY = process.env.AUTH_SECRET_KEY || 'geheime_sleutel';
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY || 'geheime_refresh_sleutel';

// Middleware voor het verifiëren van tokens
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization'); // Verkrijg het token uit de Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Geen toegang, token ontbreekt' });
  }

  try {
    // Verifieer het access token
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Voeg de gedecodeerde informatie toe aan het request object
    next();
  } catch (error) {
    console.error('JWT verificatie mislukt:', error.message);

    // Als het access token is verlopen, proberen we het refresh token
    if (error.name === 'TokenExpiredError') {
      const refreshToken = req.header('Refresh-Token'); // Verkrijg het refresh token uit de header

      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token ontbreekt' });
      }

      // Verifieer het refresh token
      try {
        const decodedRefresh = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
        // Genereer een nieuw access token met de gegevens van het refresh token
        const newAccessToken = jwt.sign(
          { userId: decodedRefresh.userId, email: decodedRefresh.email },
          SECRET_KEY,
          { expiresIn: '1h' } // Standaard verlopen na 1 uur
        );

        // Stuur het nieuwe access token terug in de response
        res.json({ accessToken: newAccessToken });
      } catch (refreshError) {
        console.error('Refresh token verificatie mislukt:', refreshError.message);
        return res.status(401).json({ message: 'Ongeldig refresh token' });
      }
    } else {
      return res.status(401).json({ message: 'Ongeldige token' });
    }
  }
};

export default authMiddleware;
