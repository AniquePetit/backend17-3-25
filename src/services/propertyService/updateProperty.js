import prisma from '../../../prisma/prismaClient.js';  // Relatief pad naar prismaClient.js

const updateProperty = async (id, propertyData) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      // Als accommodatie niet gevonden is, geef null terug (voor een 404 scenario)
      return null;
    }

    console.log("Ontvangen propertyData:", propertyData); // Debugging log

    return await prisma.property.update({
      where: { id },
      data: {
        title: propertyData.title || property.title,
        description: propertyData.description || property.description,
        location: propertyData.location || property.location,
        pricePerNight: propertyData.pricePerNight || property.pricePerNight,
        bedroomCount: propertyData.bedroomCount || property.bedroomCount,
        bathRoomCount: propertyData.bathRoomCount || property.bathRoomCount,
        maxGuestCount: propertyData.maxGuestCount || property.maxGuestCount,
        rating: propertyData.rating || property.rating,
      },
    });
  } catch (error) {
    console.error('Fout bij het updaten van accommodatie:', error);
    throw error;
  }
};

export default updateProperty;
