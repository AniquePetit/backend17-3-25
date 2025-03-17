import prisma from '../../../prisma/prismaClient.js';  // Relatief pad naar prismaClient.js

const updateBooking = async (id, updatedData) => {
  try {
    const bookingExists = await prisma.booking.findUnique({
      where: { id },
    });

    if (!bookingExists) {
      // Als de boeking niet bestaat, geef null terug (voor een 404 scenario)
      return null;
    }

    return await prisma.booking.update({
      where: { id },
      data: updatedData,
    });
  } catch (error) {
    console.error('Fout bij bijwerken van boeking:', error);
    throw error;
  }
};

export default updateBooking;
