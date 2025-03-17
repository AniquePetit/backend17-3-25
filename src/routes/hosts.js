import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import prisma from '../../prisma/prismaClient.js';
import { createHost, getHostById, updateHost, deleteHost, getAllHosts } from '../services/hostService/hostService.js';

const router = express.Router();

// ✅ Haal alle hosts op (zonder authenticatie, met ondersteuning voor queryparameter 'name')
router.get('/', async (req, res) => {
  const { name } = req.query;  // Haal de 'name' queryparameter op

  try {
    // Gebruik getAllHosts om hosts op te halen, met de mogelijkheid om te filteren op naam
    const hosts = await getAllHosts(name);  

    // Als er geen hosts gevonden zijn, stuur dan een 404 status terug
    if (hosts.length === 0) {
      return res.status(404).json({ message: 'Geen hosts gevonden' });
    }

    res.json(hosts);
  } catch (error) {
    console.error('Fout bij het ophalen van hosts:', error);
    res.status(500).json({ message: 'Fout bij ophalen van hosts' });
  }
});

// ✅ Haal één host op via ID (zonder authenticatie)
router.get('/:id', async (req, res) => {
  try {
    const host = await getHostById(req.params.id);

    if (!host) {
      return res.status(404).json({ message: `Host met ID ${req.params.id} niet gevonden` });
    }

    res.json(host);
  } catch (error) {
    console.log('Fout bij ophalen van host:', error);
    res.status(500).json({ message: 'Fout bij ophalen van host', error: error.message });
  }
});

// ✅ Maak een nieuwe host aan (met authenticatie)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newHost = await createHost(req.body);
    res.status(201).json(newHost);
  } catch (error) {
    console.log('Fout bij het aanmaken van host:', error);
    res.status(400).json({ message: error.message });
  }
});

// ✅ Werk een bestaande host bij (PUT) (met authenticatie)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedHost = await updateHost(req.params.id, req.body);

    if (!updatedHost) {
      return res.status(404).json({ message: `Host met ID ${req.params.id} niet gevonden` });
    }

    res.json(updatedHost);
  } catch (error) {
    console.log('Fout bij het bijwerken van host:', error);
    res.status(500).json({ message: 'Fout bij bijwerken van host', error: error.message });
  }
});

// ✅ Verwijder een host (DELETE) (met authenticatie)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedHost = await deleteHost(req.params.id);

    if (!deletedHost) {
      return res.status(404).json({ message: `Host met ID ${req.params.id} niet gevonden` });
    }

    res.json({ message: `Host met ID ${req.params.id} succesvol verwijderd`, host: deletedHost });
  } catch (error) {
    console.log('Fout bij het verwijderen van host:', error);
    res.status(500).json({ message: 'Fout bij verwijderen van host', error: error.message });
  }
});

export default router;
