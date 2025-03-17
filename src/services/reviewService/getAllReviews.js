// src/services/reviewService/getAllReviews.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getAllReviews = async () => {
  try {
    return await prisma.review.findMany();
  } catch (error) {
    console.error('Error getting all reviews:', error);
    throw new Error('Fout bij ophalen van reviews');
  }
};

export default getAllReviews;
