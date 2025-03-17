// src/services/reviewService/getReviewById.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getReviewById = async (id) => {
  try {
    return await prisma.review.findUnique({
      where: { id: id }, // UUID blijft string
    });
  } catch (error) {
    console.error(`Error getting review with ID ${id}:`, error);
    throw new Error('Fout bij ophalen van review');
  }
};

export default getReviewById;
