// src/services/propertyService/getAllProperties.js
import prisma from '../../../prisma/prismaClient.js';  // Relatief pad naar prismaClient.js

const getAllProperties = async () => {
  try {
    return await prisma.property.findMany({
      include: {
        host: true,
        amenities: true,
        bookings: true,
        reviews: true,
      },
    });
  } catch (error) {
    console.error('Fout bij ophalen van accommodaties:', error);
    throw new Error('Fout bij ophalen van accommodaties');
  }
};

export default getAllProperties;
