import prisma from '../../../prisma/prismaClient.js';  // Relatief pad naar prismaClient.js

const getBookingById = async (id) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        property: true,
        user: true,
      },
    });

    return booking; // Geeft `null` terug als de boeking niet bestaat
  } catch (error) {
    console.error('Fout bij ophalen van boeking via ID:', error);
    throw new Error('Fout bij ophalen van boeking via ID');
  }
};

export default getBookingById;
