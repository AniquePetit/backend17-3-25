import express from 'express';
import { login, register, refreshAccessToken } from '../services/authservice.js';

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Email en wachtwoord zijn verplicht' });
  }

  const result = await login(username, password);

  if (result.token) { // Aangepast naar de nieuwe response-structuur
    return res.json(result);
  } else {
    return res.status(401).json({ error: result.error });
  }
});

// Registratie route
router.post('/register', async (req, res) => {
  const { email, password, username, name, phoneNumber, profilePicture } = req.body;

  if (!email || !password || !username || !name || !phoneNumber || !profilePicture) {
    return res.status(400).json({ error: 'Alle velden zijn verplicht' });
  }

  const result = await register(email, password, username, name, phoneNumber, profilePicture);

  if (result.user) {
    return res.status(201).json({ user: result.user });
  } else {
    return res.status(400).json({ error: result.error });
  }
});

// Endpoint om een nieuw access token te krijgen met een refresh token
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is vereist' });
  }

  const result = await refreshAccessToken(refreshToken);

  if (result.accessToken) {
    return res.json(result);
  } else {
    return res.status(401).json({ error: result.error });
  }
});

export default router;
