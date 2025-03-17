// src/services/hostService/updateHost.js
import prisma from '../../../prisma/prismaClient.js';  // Relatief pad naar prismaClient.js

const updateHost = async (id, hostData) => {
  try {
    const host = await prisma.host.findUnique({ where: { id: id } });

    if (!host) {
      
      return null
    }

    const updatedHost = await prisma.host.update({
      where: { id: id },
      data: {
        username: hostData.username || host.username,
        email: hostData.email || host.email,
        password: hostData.password || host.password,
        phoneNumber: hostData.phoneNumber || host.phoneNumber,
        profilePicture: hostData.profilePicture || host.profilePicture,
        aboutMe: hostData.aboutMe || host.aboutMe,
        name: hostData.name || host.name,
      },
    });

    return updatedHost;
  } catch (error) {
    console.log("Fout bij het bijwerken van host:", error);
    throw new Error('Fout bij het bijwerken van host');
  }
};

export default updateHost;
