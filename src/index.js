import dotenv from 'dotenv/config';  // Zorgt ervoor dat omgevingsvariabelen worden geladen
import express from 'express';
import cors from 'cors';

// Importeren van routes
import userRoutes from './routes/users.js';
import authRouter from './routes/auth.js';
import propertyRoutes from './routes/properties.js';
import hostRoutes from './routes/hosts.js';
import amenityRoutes from './routes/amenities.js';
import bookingRoutes from './routes/bookings.js';
import reviewRoutes from './routes/reviews.js';

// Maak een nieuwe Express-app
const app = express();

// Middleware
app.use(cors()); // Zorgt ervoor dat andere domeinen toegang hebben
app.use(express.json()); // Zorgt ervoor dat JSON-requests goed worden verwerkt

// Test route om te zien of de server draait
app.get('/test', (req, res) => {
  res.send('Test werkt!');
});

// Auth route (geen authenticatie vereist)
app.use('/', authRouter);

// Routes zonder globale authenticatie
app.use('/users', userRoutes);
app.use('/properties', propertyRoutes);
app.use('/hosts', hostRoutes);
app.use('/amenities', amenityRoutes);
app.use('/bookings', bookingRoutes);
app.use('/reviews', reviewRoutes);

// Foutafhandelingsroute voor onbekende routes (404)
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Algemene foutafhandelingsmiddleware (voorbeeld van hoe fouten af te handelen)
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message,
    error: process.env.NODE_ENV === 'development' ? error : {}, // Toon de foutdetails alleen in de ontwikkelmodus
  });
});

// Start de server
const PORT = process.env.PORT || 3000; // Poort kan worden ingesteld via een omgevingsvariabele
app.listen(PORT, () => {
  console.log(`Server draait op http://localhost:${PORT}`);
});
