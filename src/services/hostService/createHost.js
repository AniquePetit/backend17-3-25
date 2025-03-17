// src/services/hostService/createHost.js
import prisma from '../../../prisma/prismaClient.js';  // Relatief pad naar prismaClient.js
import bcrypt from 'bcrypt';

const createHost = async (hostData) => {
  try {
    if (!hostData.username || !hostData.email || !hostData.password || !hostData.name) {
      throw new Error('Username, email, wachtwoord en name zijn verplicht');
    }

    const existingHost = await prisma.host.findFirst({
      where: { username: hostData.username },
    });

    if (existingHost) {
      throw new Error('Username is al in gebruik');
    }

    // Hash het wachtwoord voordat je het opslaat
    const hashedPassword = await bcrypt.hash(hostData.password, 10);

    // Maak de host aan
    const newHost = await prisma.host.create({
      data: {
        username: hostData.username,
        email: hostData.email,
        password: hashedPassword,
        phoneNumber: hostData.phoneNumber,
        profilePicture: hostData.profilePicture,
        aboutMe: hostData.aboutMe,
        name: hostData.name,
      },
    });

    // Verwijder het wachtwoord uit de response
    const { password, ...hostWithoutPassword } = newHost;

    // Geef de host zonder wachtwoord terug
    return hostWithoutPassword;
  } catch (error) {
    console.log("Fout bij het aanmaken van host:", error);
    throw new Error('Fout bij het aanmaken van host');
  }
};

export default createHost;
