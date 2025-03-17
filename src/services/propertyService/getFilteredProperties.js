import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getFilteredProperties = async (query) => {
  try {
    // Voeg 'include' opties toe (host, amenities, reviews, en eventueel bookings)
    const includeOptions = {
      host: true,
      amenities: true,
      reviews: true,
      bookings: query.includeBookings === 'true' || false, // Verifieer als bookings expliciet als 'true' is opgegeven
    };

    // Log de originele query voor debugging
    console.log("Originele query:", query);

    // Pas het filter voor voorzieningen toe
    if (query.amenities) {
      let amenitiesList = query.amenities;

      // Als amenities een string is, splits deze dan in een array
      if (typeof amenitiesList === 'string') {
        amenitiesList = amenitiesList.split(',').map(item => item.trim());
      }

      // Log de amenitiesList voor debugging
      console.log('Amenities List na splitsen:', amenitiesList);

      // Zorg ervoor dat amenitiesList een array is voordat we filteren
      if (Array.isArray(amenitiesList)) {
        // De lijst van geldige voorzieningen die in de database zijn opgeslagen
        const validAmenities = ['Wifi', 'Gym', 'Pool', 'Kitchen', 'Air Conditioning', 'Heating', 'Washer', 'Dryer', 'TV', 'Free Parking'];

        // Filter de amenitiesList op basis van geldige voorzieningen
        const validAmenitiesList = amenitiesList.filter(amenity => validAmenities.includes(amenity));

        // Controleer of we een geldige lijst hebben van voorzieningen
        if (validAmenitiesList.length > 0) {
          // Pas de query aan voor amenities filtering
          query.where.amenities = {
            some: {
              name: {
                in: validAmenitiesList,  // Gebruik 'in' om een lijst van namen te zoeken
              },
            },
          };
        } else {
          console.error("Error: Geen geldige voorzieningen gevonden in de lijst.");
          return [];  // Return een lege lijst als er geen geldige voorzieningen zijn
        }
      } else {
        console.error("Error: amenitiesList is geen array:", amenitiesList);
        return [];  // Return een lege lijst als de amenitiesList geen array is
      }
    }

    // Voeg 'include' toe aan de query
    const finalQuery = {
      ...query,  // Behoud alle andere filters uit de oorspronkelijke query
      include: includeOptions,
    };

    // Log de finale query voor debugging
    console.log('Finale query met filters:', finalQuery);

    // Voer de query uit en haal de resultaten op
    const properties = await prisma.property.findMany(finalQuery);

    // Log de resultaten van de query
    console.log("Gevonden accommodaties:", properties);

    return properties;
  } catch (error) {
    // Log de fout met details
    console.error('Fout bij ophalen van accommodaties:', error);
    throw new Error('Fout bij ophalen van accommodaties: ' + error.message); // Gedetailleerde foutmelding
  }
};

export default getFilteredProperties;
