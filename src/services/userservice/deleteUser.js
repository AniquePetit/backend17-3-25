// services/deleteUser.js
import prisma from '../../../prisma/prismaClient.js';  // Relatief pad naar prismaClient.js

const deleteUser = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      // throw new Error('Gebruiker niet gevonden');
      return null
    }

    return await prisma.user.delete({
      where: { id: id },
    });
  } catch (error) {
    console.error('Fout bij het verwijderen van gebruiker:', error);
    throw error;
  }
};

export default deleteUser;
