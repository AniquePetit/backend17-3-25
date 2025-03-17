import bcrypt from 'bcryptjs';
import prisma from './prisma/prismaClient.js';



async function updateUserPasswords() {
  const users = await prisma.user.findMany();

  for (const user of users) {
    // Hash het wachtwoord
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Update het wachtwoord in de database
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    console.log(`Wachtwoord van gebruiker ${user.username} geüpdatet.`);
  }
}

updateUserPasswords().catch((error) => {
  console.error('Er is een fout opgetreden:', error);
});
