// utils/userUtils.js

import bcrypt from 'bcryptjs';
import prisma from '../../prisma/prismaClient.js';  // Relatief pad naar prismaClient.js

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const validateUserData = async (userData) => {
  if (!userData.email || !userData.password || !userData.username || !userData.pictureUrl) {
    throw new Error('Email, password, username en pictureUrl zijn verplicht');
  }

  const existingUserByUsername = await prisma.user.findUnique({
    where: { username: userData.username },
  });

  if (existingUserByUsername) {
    throw new Error('Gebruiker met dit gebruikersnaam bestaat al');
  }

  // const existingUserByEmail = await prisma.user.findMany({
  //   where: { email: userData.email },
  // });

  // if (existingUserByEmail.length > 0) {
  //   throw new Error('Dit e-mailadres is al geregistreerd');
  // }
};

export { hashPassword, validateUserData };
