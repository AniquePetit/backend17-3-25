import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../prisma/prismaClient.js';

const ACCESS_TOKEN_EXPIRATION = '1h'; // Access token verloopt na 1 uur
const REFRESH_TOKEN_EXPIRATION = '7d'; // Refresh token verloopt na 7 dagen

// Registreren van een nieuwe gebruiker
export async function register(email, password, username, name, phoneNumber, profilePicture) {
  try {
    const normalizedEmail = email.toLowerCase();

    // Check of de gebruikersnaam of het e-mailadres al bestaat
    const existingUserByEmail = await prisma.user.findFirst({ where: { email: normalizedEmail } });
    const existingUserByUsername = await prisma.user.findFirst({ where: { username: username } });

    if (existingUserByEmail) {
      return { error: 'E-mail bestaat al' };
    }

    if (existingUserByUsername) {
      return { error: 'Gebruikersnaam bestaat al' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        username,
        name,
        phoneNumber,
        profilePicture,
      },
    });

    return { user: newUser };
  } catch (error) {
    console.error('Registratiefout:', error.message);
    return { error: 'Er is een fout opgetreden tijdens de registratie' };
  }
}

// Inloggen van een gebruiker met gebruikersnaam en wachtwoord
export async function login(username, password) {
  try {
    // Zoek gebruiker op basis van gebruikersnaam
    const user = await prisma.user.findFirst({ where: { username: username } });

    if (!user) {
      return { error: 'Gebruiker niet gevonden' };
    }

    // Vergelijk het wachtwoord met het opgeslagen hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { error: 'Onjuist wachtwoord' };
    }

    // Controleer of de SECRET_KEY's aanwezig zijn in de environment variables
    if (!process.env.AUTH_SECRET_KEY || !process.env.REFRESH_SECRET_KEY) {
      throw new Error('AUTH_SECRET_KEY of REFRESH_SECRET_KEY ontbreekt in het .env-bestand');
    }

    // Maak een access token aan voor de gebruiker
    const accessToken = jwt.sign(
      { userId: user.id, username: user.username },  // Gebruikersnaam wordt toegevoegd in de payload
      process.env.AUTH_SECRET_KEY,
      { expiresIn: ACCESS_TOKEN_EXPIRATION }
    );

    // Maak een refresh token aan voor de gebruiker
    const refreshToken = jwt.sign(
      { userId: user.id, username: user.username },  // Gebruikersnaam wordt toegevoegd in de payload
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: REFRESH_TOKEN_EXPIRATION }
    );

    // Sla het refresh token op in de database voor de gebruiker
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      message: "Successfully logged in", // ✅ Aangepaste response
      token: accessToken, // ✅ Access token heet nu 'token'
    };

  } catch (error) {
    console.error('Login fout:', error.message);
    return { error: 'Er is een fout opgetreden tijdens het inloggen' };
  }
}

// Functie om een nieuw access token te genereren met een refresh token
export async function refreshAccessToken(refreshToken) {
  try {
    if (!refreshToken) {
      return { error: 'Geen refresh token opgegeven' };
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user || user.refreshToken !== refreshToken) {
      return { error: 'Ongeldig of verlopen refresh token' };
    }

    const newAccessToken = jwt.sign(
      { userId: user.id, username: user.username },  // Gebruikersnaam wordt toegevoegd in de payload
      process.env.AUTH_SECRET_KEY,
      { expiresIn: ACCESS_TOKEN_EXPIRATION }
    );

    return { accessToken: newAccessToken };
  } catch (error) {
    console.error('Fout bij refresh token:', error.message);
    return { error: 'Ongeldig of verlopen refresh token' };
  }
}
