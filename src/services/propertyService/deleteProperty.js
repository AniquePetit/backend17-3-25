import prisma from '../../../prisma/prismaClient.js';  // Zorg ervoor dat dit het juiste pad is

const deleteProperty = async (id) => {
  try {
    // Zoek de property op basis van het id
    const property = await prisma.property.findUnique({
      where: { id },  // Zoek naar de property met het meegegeven id
    });

    if (!property) {
      // Als de property niet gevonden is, geef null terug
      return null;
    }

    // Verwijder de property uit de database
    return await prisma.property.delete({
      where: { id },  // Verwijder de property met het opgegeven id
    });
  } catch (error) {
    console.error('Fout bij verwijderen van property:', error);
    throw error;  // Hergooi de fout, zodat deze verder kan worden afgehandeld in de router
  }
};

export default deleteProperty;
