import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); // Declareer één PrismaClient instantie

const getAllHosts = async (name) => {
  try {
    // Stel een zoekquery in voor de hosts
    const query = {
      where: {},
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        listings: true,
      },
    };

    // Als de naam wordt meegegeven, voeg deze toe aan de zoekquery
    if (name) {
      console.log(`Zoeken naar hosts met naam: '${name}'`); // Log de zoekopdracht

      // Voeg de zoekwaarde toe aan de query zonder 'mode: insensitive'
      query.where.name = {
        contains: name.trim(),  // Zoek naar naam zonder case insensitivity
      };
    }

    // Log de gebruikte query voor debuggen
    console.log("Gebruikte query:", query);

    // Voer de query uit en log het resultaat
    const hosts = await prisma.host.findMany(query);
    console.log("Opgehaalde hosts:", hosts); // Log de opgehaalde hosts

    // Als er geen hosts gevonden zijn, retourneer dan een lege array
    if (!hosts || hosts.length === 0) {
      console.log("Geen hosts gevonden");
      return [];  // Retourneer een lege array als er geen hosts zijn
    }

    return hosts;
  } catch (error) {
    console.error("Fout bij ophalen van hosts:", error); // Log de fout
    throw new Error('Fout bij het ophalen van hosts');
  }
};

export default getAllHosts;
