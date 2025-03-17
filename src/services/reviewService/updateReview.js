// src/services/reviewService/updateReview.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const updateReview = async (id, reviewData) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: id }, // UUID blijft string
    });

    if (!review) {
      return null;
    }

    return await prisma.review.update({
      where: { id: id },
      data: {
        rating: reviewData.rating ?? review.rating,
        comment: reviewData.comment ?? review.comment,
      },
    });
  } catch (error) {
    console.error(`Error updating review with ID ${id}:`, error);
    throw new Error('Fout bij bijwerken van review');
  }
};

export default updateReview;
