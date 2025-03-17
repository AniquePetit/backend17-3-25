// services/amenity/createAmenity.js
import prisma from '../../../prisma/prismaClient.js';  // Relatief pad naar prismaClient.js

export const createAmenity = async (data) => {
  if (!data.name) throw new Error('Naam is verplicht');

  return await prisma.amenity.create({
    data: {
      name: data.name,
    },
  });
};
