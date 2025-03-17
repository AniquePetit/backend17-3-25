import prisma from '../../../prisma/prismaClient.js';  // Relatief pad naar prismaClient.js

// Maak een nieuwe boeking aan
const createBooking = async (bookingData) => {
  return await prisma.booking.create({
    data: bookingData,
  });
};

export default createBooking;
