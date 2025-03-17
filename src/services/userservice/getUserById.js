import prisma from '../../../prisma/prismaClient.js';

const getUserById = async (id) => {
  try {
    // Controleer of id een geldige waarde heeft
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('Id should be a non-empty string');
    }

    // Log de id die wordt opgevraagd om te controleren of deze goed is
    console.log("Zoeken naar gebruiker met id:", id);

    // Voer de query uit om de gebruiker op te halen
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        username: true,
        email: true,
        phoneNumber: true,
        pictureUrl: true,
        profilePicture: true,
      },
    });

    // Log het resultaat van de Prisma-query
    console.log("Resultaat van Prisma-query:", user);

    if (!user) {
      console.log("Geen gebruiker gevonden voor id:", id);  // Log als gebruiker niet wordt gevonden
      return null; // We geven gewoon `null` terug in plaats van een fout te gooien
    }

    return user;
  } catch (error) {
    console.error("Fout bij ophalen van gebruiker:", error.message);  // Log de specifieke fout
    throw new Error('Fout bij ophalen van gebruiker');
  }
};

export default getUserById;
