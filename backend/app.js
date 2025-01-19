import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import reviewRoutes from './routes/reviews.js';

dotenv.config();

const app = express();
app.use(cors());

// Define routes
app.use('/api/reviews', reviewRoutes);

export default app;
