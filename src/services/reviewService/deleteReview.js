// src/services/reviewService/deleteReview.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const deleteReview = async (id) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: id }, // Zoek de review op basis van het ID
    });

    if (!review) {
      return null; // Als de review niet gevonden wordt, return null
    }

    return await prisma.review.delete({
      where: { id: id },
    });
  } catch (error) {
    console.error(`Error deleting review with ID ${id}:`, error);
    throw new Error('Fout bij verwijderen van review');
  }
};

export default deleteReview;
