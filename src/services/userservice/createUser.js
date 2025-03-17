// services/createUser.js
import prisma from '../../../prisma/prismaClient.js';  // Relatief pad naar prismaClient.js
import { hashPassword, validateUserData } from '../../utils/userutils.js';

const createUser = async (userData) => {
  try {
    // Valideer de gebruikersdata
    await validateUserData(userData);

    // Wachtwoord hashen
    const hashedPassword = await hashPassword(userData.password);

    const newUser = await prisma.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        password: hashedPassword,
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        pictureUrl: userData.pictureUrl,
      },
    });

    return newUser;
  } catch (error) {
    console.error('Fout bij het aanmaken van gebruiker:', error);
    throw new Error(`Fout bij het aanmaken van gebruiker: ${error.message}`);
  }
};

export default createUser;
