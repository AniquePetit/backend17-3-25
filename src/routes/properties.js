import express from 'express';
import * as propertyService from '../services/propertyService/propertyService.js';
import authMiddleware from '../middleware/authMiddleware.js';  // Zorg ervoor dat je authMiddleware importeert

const router = express.Router();

// GET all properties with query parameters
router.get('/', async (req, res) => {
  const { location, pricePerNight, amenities, includeBookings } = req.query;
  console.log("Verzoek voor accommodaties ontvangen met query:", req.query);

  try {
    const query = {
      include: {
        host: true,
        amenities: true,
        reviews: true,
        bookings: includeBookings === 'true',
      },
      where: {},
    };

    // Validatie en filtering op locatie
    if (location) {
      query.where.location = { contains: location };  // Verwijder de 'mode' en gebruik alleen 'contains'
      console.log('Location filter toegepast:', location);
    }

    // Validatie en filtering op prijs per nacht
    if (pricePerNight) {
      const price = parseFloat(pricePerNight);
      if (isNaN(price)) {
        return res.status(400).json({ message: 'Prijs per nacht moet een geldig getal zijn.' });
      } else {
        query.where.pricePerNight = { gte: price };
        console.log('Price filter toegepast:', pricePerNight);
      }
    }

    // Filtering op voorzieningen
    if (amenities) {
      const amenitiesArray = amenities.split(',').map(item => item.trim());
      query.where.amenities = {
        some: {
          name: {
            in: amenitiesArray,
          },
        },
      };
      console.log('Filtering met voorzieningen:', amenitiesArray);
    }

    // Ophalen van de properties via de service
    const properties = await propertyService.getFilteredProperties(query);
    console.log('Gevonden accommodaties:', properties);

    if (properties.length === 0) {
      return res.status(404).json({ message: 'Geen accommodaties gevonden' });
    }

    res.json(properties);
  } catch (error) {
    console.error('Fout bij ophalen van accommodaties:', error);
    res.status(500).json({ message: 'Fout bij ophalen van accommodaties', error: error.message });
  }
});

// GET a single property by ID
router.get('/:id', async (req, res) => {
  const propertyId = req.params.id;

  // ID validatie: controleer of de ID geldig is
  if (!propertyId || typeof propertyId !== 'string' || propertyId.trim().length === 0) {
    return res.status(400).json({ message: 'ID moet een geldige niet-lege string zijn' });
  }

  console.log(`Verzoek om accommodatie met ID ${propertyId} op te halen`);
  
  try {
    // Ophalen van de property via de service
    const property = await propertyService.getPropertyById(propertyId);

    if (!property) {
      return res.status(404).json({ message: 'Accommodatie niet gevonden' });
    }

    res.json(property);
  } catch (error) {
    console.error('Fout bij ophalen van accommodatie:', error);
    res.status(500).json({ message: 'Fout bij ophalen van accommodatie', error: error.message });
  }
});

// PUT - Update an existing property (authentication required)
router.put('/:id', authMiddleware, async (req, res) => {
  const { hostId } = req.body;

  console.log(`Verzoek om accommodatie met ID ${req.params.id} bij te werken`, req.body);

  try {
    // Validatie van de velden
    if (!req.body.title || !req.body.description || !req.body.location || !req.body.pricePerNight) {
      return res.status(400).json({ message: 'Vereiste velden ontbreken.' });
    }

    // Verwerk de property update
    const updatedProperty = await propertyService.updateProperty(req.params.id, req.body);

    if (!updatedProperty) {
      return res.status(404).json({ message: 'Accommodatie niet gevonden voor bijwerken' });
    }

    console.log("Accommodatie bijgewerkt:", updatedProperty);
    res.json(updatedProperty);
  } catch (error) {
    console.error('Fout bij bijwerken van accommodatie:', error);
    res.status(500).json({ message: 'Fout bij bijwerken van accommodatie', error: error.message });
  }
});

// POST - Create a new property (authentication required)
router.post('/', authMiddleware, async (req, res) => {
  console.log("Ontvangen data voor nieuwe accommodatie:", req.body);

  try {
    const {
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      rating,
      hostId,
    } = req.body;

    // Valideer de vereiste velden
    if (!title || !description || !location || !pricePerNight || !bedroomCount || !bathRoomCount || !maxGuestCount || !hostId) {
      return res.status(400).json({ message: 'Vereiste velden ontbreken' });
    }

    // Extra validatie voor numerieke velden
    if (isNaN(pricePerNight) || isNaN(bedroomCount) || isNaN(bathRoomCount) || isNaN(maxGuestCount)) {
      return res.status(400).json({ message: 'Prijs, slaapkamer, badkamer of max. gasten moeten geldige getallen zijn.' });
    }

    const newProperty = await propertyService.createProperty(hostId, req.body);
    console.log("Nieuwe accommodatie aangemaakt:", newProperty);
    res.status(201).json(newProperty);
  } catch (error) {
    console.error('Fout bij aanmaken van accommodatie:', error);
    res.status(500).json({ message: 'Fout bij aanmaken van accommodatie', error: error.message });
  }
});

// DELETE - Delete a property (authentication required)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const propertyId = req.params.id;

    // Verwijder de property via de service
    const deletedProperty = await propertyService.deleteProperty(propertyId);

    if (!deletedProperty) {
      return res.status(404).json({ message: `Property met ID ${propertyId} niet gevonden` });
    }

    // Bevestiging van succesvolle verwijdering
    res.json({ message: `Property met ID ${propertyId} succesvol verwijderd`, property: deletedProperty });
  } catch (error) {
    console.error('Fout bij verwijderen van accommodatie:', error);
    res.status(500).json({ message: 'Fout bij verwijderen van accommodatie', error: error.message });
  }
});

export default router;
