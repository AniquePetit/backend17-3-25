import { PrismaClient } from '@prisma/client';  // PrismaClient importeren
const prisma = new PrismaClient();

const createProperty = async (hostId, propertyData) => {
  try {
    // Controleer of de host bestaat
    const host = await prisma.host.findUnique({
      where: { id: hostId },
    });

    if (!host) {
      // Als de host niet bestaat, gooi een duidelijke fout
      throw new Error(`Host met id ${hostId} bestaat niet in de database.`);
    }

    // Maak de accommodatie aan
    const newProperty = await prisma.property.create({
      data: {
        title: propertyData.title,
        description: propertyData.description,
        location: propertyData.location,
        pricePerNight: parseFloat(propertyData.pricePerNight),  // Direct met float werken
        bedroomCount: propertyData.bedroomCount,
        bathRoomCount: propertyData.bathRoomCount,
        maxGuestCount: propertyData.maxGuestCount,
        rating: propertyData.rating || 0,  // Zorg ervoor dat er een rating is, anders stel een standaardwaarde in.
        host: {
          connect: { id: hostId }, // Verbind de accommodatie met de host via het hostId
        },
      },
    });

    // Return de nieuwe accommodatie als deze succesvol is aangemaakt
    return newProperty;

  } catch (error) {
    // Print de fout in de console voor debugging
    console.error('Fout bij het aanmaken van accommodatie:', error);

    // Gooi de fout opnieuw zodat deze verder kan worden afgevangen door de route
    throw new Error(`Fout bij het aanmaken van accommodatie: ${error.message}`);
  }
};

export default createProperty;
