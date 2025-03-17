// services/userservice/getAllUsers.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getAllUsers = async (username, email) => {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany({
    where: {
      username: {
        contains: username,
      },
      email: {
        contains: email,
      },
    },
      select: {
        id: true,
        username: true,
        email: true,
        phoneNumber: true,
        pictureUrl: true,
        profilePicture: true,
      
      
      },
    
  });

  return users;
};

export default getAllUsers;

// // const getAllUsers = async (filter = {}) => {
//   try {
//     const query = {
//       where: {},
//     };

//     // Als er een email in de filter is, voeg die toe aan de query
//     if (filter.email) {
//       query.where.email = filter.email;  // Filter op email
//     }

//     // Zoek naar gebruikers op basis van de opgegeven filter
//     return await prisma.user.findMany(query);
//   } catch (error) {
//     console.error('Fout bij ophalen van gebruikers:', error);
//     throw new Error('Fout bij ophalen van gebruikers');
//   }
// };

// export default getAllUsers;
