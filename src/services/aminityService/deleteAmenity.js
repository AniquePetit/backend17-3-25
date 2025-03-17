// services/amenity/deleteAmenity.js
import prisma from '../../../prisma/prismaClient.js';  // Relatief pad naar prismaClient.js

export const deleteAmenity = async (id) => {
  try {
    return await prisma.amenity.delete({
      where: { id },
    });
  } catch (error) {
    return null; // Als de voorziening niet bestaat, geef null terug
  }
};
