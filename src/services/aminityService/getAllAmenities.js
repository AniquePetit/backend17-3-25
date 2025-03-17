// services/amenity/getAllAmenities.js
import prisma from '../../../prisma/prismaClient.js';  // Relatief pad naar prismaClient.js

export const getAllAmenities = async () => {
  return await prisma.amenity.findMany();
};
