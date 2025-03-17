// services/amenity/getAmenityById.js
import prisma from '../../../prisma/prismaClient.js';  // Relatief pad naar prismaClient.js

export const getAmenityById = async (id) => {
  return await prisma.amenity.findUnique({
    where: { id },
  });
};
