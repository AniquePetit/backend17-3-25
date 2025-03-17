// src/services/hostService/getHostById.js

import prisma from '../../../prisma/prismaClient.js';  // Relatief pad naar prismaClient.js

const getHostById = async (id) => {
  try {
    const host = await prisma.host.findUnique({
      where: { id: id },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        listings: true,  // Voeg hier ook de property listings toe als dat nodig is
      },
    });

    if (!host) {
      return null;
    }

    return host;
  } catch (error) {
    console.log("Fout bij ophalen van host:", error);
    throw new Error('Fout bij ophalen van host');
  }
};

export default getHostById;
