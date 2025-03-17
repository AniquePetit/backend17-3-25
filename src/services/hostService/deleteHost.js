import prisma from '../../../prisma/prismaClient.js';

const deleteHost = async (id) => {
  try {
    const host = await prisma.host.findUnique({ where: { id } });

    if (!host) {
      return null;
    }

    return await prisma.host.delete({ where: { id } });
  } catch (error) {
    console.log('Fout bij verwijderen van host:', error);
    throw new Error('Fout bij verwijderen van host');
  }
};

export default deleteHost;  // ✅ Default export toegevoegd
