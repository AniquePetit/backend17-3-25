// src/services/reviewService/createReview.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const createReview = async (data) => {
  try {
    if (!data.userId || !data.propertyId || !data.rating || !data.comment) {
      throw new Error('Alle vereiste velden moeten ingevuld zijn');
    }

    const userExists = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!userExists) {
      throw new Error('De opgegeven gebruiker bestaat niet');
    }

    const propertyExists = await prisma.property.findUnique({
      where: { id: data.propertyId },
    });

    if (!propertyExists) {
      throw new Error('De opgegeven woning bestaat niet');
    }

    return await prisma.review.create({
      data: {
        userId: data.userId,
        propertyId: data.propertyId, // Geen String() nodig, blijft gewoon een string
        rating: data.rating,
        comment: data.comment,
      },
    });
  } catch (error) {
    console.error('Error creating review:', error);
    throw new Error('Fout bij aanmaken van review');
  }
};

export default createReview;
