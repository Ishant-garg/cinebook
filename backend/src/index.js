import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import authRoute from './routes/authRoute.js';
import movieRoute from './routes/movieRoute.js';
import theaterRoute from './routes/theaterRoute.js';
import showRoute from './routes/showRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { getTheatersByDateAndMovie } from './controllers/theater.controllers.js';

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());

const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:5173",
  "https://cinebook-git-main-ishantgargs-projects.vercel.app",
  "https://cinebook-blond.vercel.app",
  "https://cinebook-dashboard.vercel.app"
].filter(Boolean);

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie']
}));

// Pre-flight requests
app.options('*', cors());

// Health check route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// API routes
app.use("/api/auth", authRoute);
app.use("/api/movie", movieRoute);
app.use("/api/theater", theaterRoute);
app.use("/api", showRoute);
app.get("/api/theaters", getTheatersByDateAndMovie);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// Connect to database and start server
if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
    try {
      await connectDB();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  });
}

// Export for Vercel
export default app;