import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getAllUsers, createUser, getUserById, updateUser, deleteUser } from '../services/userservice/userservice.js';

const router = express.Router();

// ✅ Publieke route: Haal alle gebruikers op (met optionele filtering via queryparams zoals email of username)
router.get('/', async (req, res) => {
  try {
    const { email, username } = req.query;  // Haal de queryparameters email en username op (indien aanwezig)
    console.log("email:", email);
    console.log("username:", username);
    const users = await getAllUsers(username, email);
    console.log("Opgehaalde gebruikers:", users);
    res.json(users);
  } catch (error) {
    console.error("Fout bij ophalen van gebruikers:", error.message);  // Toegevoegde log
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Publieke route: Haal een specifieke gebruiker op (geen authenticatie nodig)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Opgehaalde id:", id);  // Log de id die wordt opgevraagd

    // Zoek gebruiker op basis van id
    const user = await getUserById(id);

    // Als gebruiker niet bestaat, geef een 404 met een duidelijke foutmelding
    if (!user) {
      console.log("Geen gebruiker gevonden met id:", id);  // Log als de gebruiker niet wordt gevonden
      return res.status(404).json({ message: `Gebruiker met id ${id} niet gevonden` });
    }

    // Als de gebruiker gevonden is, stuur de gegevens terug
    res.json(user);
  } catch (error) {
    console.error("Fout bij ophalen van gebruiker:", error.message);  // Log de fout die wordt opgegooid
    res.status(500).json({ error: 'Fout bij ophalen van gebruiker' });
  }
});

// ✅ Beveiligde route: Maak een nieuwe gebruiker aan
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userData = req.body;

    // Stel een standaard profielafbeelding in als deze niet meegegeven is
    if (!userData.pictureUrl) {
      userData.pictureUrl = 'https://example.com/default-profile-pic.jpg';
    }

    const newUser = await createUser(userData);  // De createUser functie uit de service aanroepen
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Fout bij het aanmaken van gebruiker:', error);
    res.status(400).json({ error: error.message });
  }
});

// ✅ Beveiligde route: Update een gebruiker
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phoneNumber, pictureUrl } = req.body;

    // Controleer of verplichte velden aanwezig zijn
    if (!name || !email || !phoneNumber) {
      return res.status(400).json({ message: 'Naam, email en telefoonnummer zijn verplicht' });
    }

    // Update de gebruiker op basis van id
    const updatedUser = await updateUser(id, { name, email, phoneNumber, pictureUrl });

    // Als de gebruiker niet bestaat, geef dan een 404 foutmelding
    if (!updatedUser) {
      return res.status(404).json({ message: `Gebruiker met id ${id} niet gevonden` });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Fout bij bijwerken van gebruiker:', error);
    res.status(500).json({ error: 'Fout bij bijwerken van gebruiker' });
  }
});

// ✅ Beveiligde route: Verwijder een gebruiker
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    // Verwijder de gebruiker op basis van id
    const deleted = await deleteUser(id);

    // Als de gebruiker niet bestaat, geef dan een 404 foutmelding
    if (!deleted) {
      return res.status(404).json({ message: `Gebruiker met id ${id} niet gevonden` });
    }

    res.json({ message: 'Gebruiker verwijderd' });
  } catch (error) {
    console.error('Fout bij verwijderen van gebruiker:', error);
    res.status(500).json({ error: 'Fout bij verwijderen van gebruiker' });
  }
});

export default router;
