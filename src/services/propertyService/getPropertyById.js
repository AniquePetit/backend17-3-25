import prisma from '../../../prisma/prismaClient.js';

const getPropertyById = async (id) => {
  // Validatie of de ID niet leeg is en een string is
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    throw new Error('ID moet een geldige niet-lege string zijn');
  }

  try {
    // Zoek de property op via de ID
    const property = await prisma.property.findUnique({
      where: { id: id },
      include: {
        host: true,
        amenities: true,
        reviews: true,
        bookings: true,
      },
    });

    if (!property) {
      return null;  // Als de property niet gevonden is
    }

    return property;
  } catch (error) {
    console.log('Fout bij ophalen van property:', error);
    throw new Error('Fout bij het ophalen van property');
  }
};

export default getPropertyById;
