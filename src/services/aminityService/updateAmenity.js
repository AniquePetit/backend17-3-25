// services/amenity/updateAmenity.js
import prisma from '../../../prisma/prismaClient.js';  // Relatief pad naar prismaClient.js

export const updateAmenity = async (id, data) => {
  return await prisma.amenity.update({
    where: { id },
    data,
  });
};
