import prisma from '../../../prisma/prismaClient.js';  // Relatief pad naar prismaClient.js

const deleteBooking = async (id) => {
  try {
    const bookingExists = await prisma.booking.findUnique({
      where: { id },
    });

    if (!bookingExists) {
      // Als de boeking niet bestaat, geef null terug (voor een 404 scenario)
      return null;
    }

    return await prisma.booking.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Fout bij verwijderen van boeking:', error);
    throw error;
  }
};

export default deleteBooking;
