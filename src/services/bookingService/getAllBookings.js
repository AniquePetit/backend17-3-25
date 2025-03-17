import prisma from '../../../prisma/prismaClient.js';  // Relatief pad naar prismaClient.js

// Haal boekingen op voor een specifieke gebruiker (of voor alle boekingen als geen userId is meegegeven)
const getAllBookings = async (userId = null) => {
  try {
    // Als er geen userId is, haal dan gewoon alle boekingen op
    if (!userId) {
      return await prisma.booking.findMany({
        include: { property: true }, // Voeg extra info over het property toe als nodig
      });
    }

    // Controleer of de gebruiker bestaat
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new Error('Gebruiker bestaat niet');
    }

    // Haal de boekingen op voor de gebruiker
    return await prisma.booking.findMany({
      where: { userId: userId },
      include: { property: true }, // Voeg extra info over het property toe als nodig
    });
  } catch (error) {
    console.error('Fout bij het ophalen van boekingen:', error);
    throw new Error('Fout bij het ophalen van boekingen');
  }
};

export default getAllBookings;
