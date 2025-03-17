import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import * as bookingService from '../services/bookingService/bookingService.js';

const router = express.Router();

// ✅ Maak een nieuwe boeking aan (met authenticatie)
router.post('/', authMiddleware, async (req, res) => {
  console.log("Ontvangen data voor nieuwe boeking:", req.body);

  try {
    const { userId, propertyId, checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus } = req.body;

    // Validatie van de vereiste velden
    if (!userId || !propertyId || !checkinDate || !checkoutDate || !numberOfGuests || !totalPrice) {
      return res.status(400).json({ message: 'Vereiste velden ontbreken' });
    }

    // Extra validatie voor numerieke velden
    if (isNaN(numberOfGuests) || isNaN(totalPrice)) {
      return res.status(400).json({ message: 'Aantal gasten of totaalprijs moeten geldige getallen zijn.' });
    }

    const newBooking = await bookingService.createBooking({
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus: bookingStatus || "pending",
    });
    console.log("Nieuwe boeking aangemaakt:", newBooking);  // Log de aangemaakte boeking
    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Fout bij aanmaken van boeking:', error);
    res.status(500).json({ message: 'Fout bij aanmaken van boeking', error: error.message });
  }
});

// ✅ Haal alle boekingen op (zonder authenticatie)
router.get('/', async (req, res) => {
  console.log("Verzoek om boekingen op te halen");  // Log het verzoek

  try {
    const bookings = await bookingService.getAllBookings();

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Geen boekingen gevonden' });
    }

    res.json(bookings);  // Stuur de boekingen terug als response
  } catch (error) {
    console.error('Fout bij ophalen van boekingen:', error);
    res.status(500).json({ message: 'Fout bij ophalen van boekingen', error: error.message });
  }
});

// ✅ Haal een specifieke boeking op via ID (zonder authenticatie)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  console.log(`Verzoek om boeking met ID ${id} op te halen`);  // Log het ID voor ophalen van de boeking
  try {
    const booking = await bookingService.getBookingById(id);

    if (!booking) {
      return res.status(404).json({ message: `Boeking met ID ${id} niet gevonden` });
    }

    res.json(booking);
  } catch (error) {
    console.error('Fout bij ophalen van boeking:', error);
    res.status(500).json({ message: 'Fout bij ophalen van boeking', error: error.message });
  }
});

// ✅ Werk een bestaande boeking bij (PUT) (met authenticatie)
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus } = req.body;

  console.log(`Verzoek om boeking met ID ${id} bij te werken`);  // Log het verzoek

  try {
    const updatedBooking = await bookingService.updateBooking(id, {
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus,
    });

    if (!updatedBooking) {
      return res.status(404).json({ message: `Boeking met ID ${id} niet gevonden om bij te werken` });
    }

    console.log("Boeking bijgewerkt:", updatedBooking);  // Log de bijgewerkte boeking
    res.json(updatedBooking);
  } catch (error) {
    console.error('Fout bij bijwerken van boeking:', error);
    res.status(500).json({ message: 'Fout bij bijwerken van boeking', error: error.message });
  }
});

// ✅ Verwijder een boeking (DELETE) (met authenticatie)
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  console.log(`Verzoek om boeking met ID ${id} te verwijderen`);  // Log het ID van de boeking die verwijderd wordt

  try {
    const deletedBooking = await bookingService.deleteBooking(id);

    if (!deletedBooking) {
      return res.status(404).json({ message: `Boeking met ID ${id} niet gevonden om te verwijderen` });
    }

    console.log("Boeking verwijderd:", deletedBooking);  // Log de verwijderde boeking
    res.json({ message: `Boeking met ID ${id} succesvol verwijderd`, booking: deletedBooking });
  } catch (error) {
    console.error('Fout bij verwijderen van boeking:', error);
    res.status(500).json({ message: 'Fout bij verwijderen van boeking', error: error.message });
  }
});

export default router;
