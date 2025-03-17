import prisma from '../../../prisma/prismaClient.js';  // Relatief pad naar prismaClient.js

const updateUser = async (id, userData) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      // throw new Error('Gebruiker niet gevonden');
      return null
    }

    return await prisma.user.update({
      where: { id: id },
      data: {
        name: userData.name || user.name,
        email: userData.email || user.email,
        phoneNumber: userData.phoneNumber || user.phoneNumber,
        pictureUrl: userData.pictureUrl || user.pictureUrl,
      },
    });
  } catch (error) {
    console.error('Fout bij het updaten van gebruiker:', error);
    throw error;
  }
};

export default updateUser;
