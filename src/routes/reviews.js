import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';  // Voeg de authMiddleware toe
import { getAllReviews, getReviewById, createReview, updateReview, deleteReview } from '../services/reviewService/reviewService.js';

const router = express.Router();

// ✅ Haal alle reviews op (zonder authenticatie)
router.get('/', async (req, res) => {
  try {
    const reviews = await getAllReviews();
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fout bij ophalen van reviews' });
  }
});

// ✅ Haal een specifieke review op via ID (zonder authenticatie)
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id; // ✅ UUID blijft een string!
    
    const review = await getReviewById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review niet gevonden' });
    }
    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fout bij ophalen van review' });
  }
});

// ✅ Maak een nieuwe review aan (met authenticatie)
router.post('/', authMiddleware, async (req, res) => {  // authMiddleware toegevoegd
  try {
    const { userId, propertyId, rating, comment } = req.body;

    if (!userId || !propertyId || !rating || !comment) {
      return res.status(400).json({ message: 'Alle velden zijn verplicht' });
    }

    const newReview = await createReview(req.body);
    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fout bij aanmaken van review' });
  }
});

// ✅ Werk een bestaande review bij (PUT) (met authenticatie)
router.put('/:id', authMiddleware, async (req, res) => {  // authMiddleware toegevoegd
  try {
    const id = req.params.id; // ✅ UUID blijft een string!
    
    const updatedReview = await updateReview(id, req.body);

    if (!updatedReview) {
      return res.status(404).json({ message: 'Review niet gevonden' });
    }

    res.json(updatedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fout bij bijwerken van review' });
  }
});

// ✅ Verwijder een review via ID (DELETE) (met authenticatie)
router.delete('/:id', authMiddleware, async (req, res) => {  // authMiddleware toegevoegd
  try {
    const id = req.params.id; // Haal de review ID op uit de URL

    const deletedReview = await deleteReview(id); // Verwijder de review via de servicefunctie

    if (!deletedReview) {
      return res.status(404).json({ message: 'Review niet gevonden' });
    }

    res.status(200).json({ message: 'Review succesvol verwijderd' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fout bij verwijderen van review' });
  }
});

export default router;
