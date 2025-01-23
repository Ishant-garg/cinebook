import express from 'express';
import {
  createShow,
  updateShow,
  deleteShow,
  getShowById,
  getShowsByTheater,
  getShowsByMovie
} from '../controllers/show.controllers.js';

const router = express.Router();

// Create a new show for a theater
router.post('/theater/:theaterId/shows', createShow);

// Update a show
router.put('/theater/shows/:showId', updateShow);

// Delete a show
router.delete('/theater/shows/:showId', deleteShow);

// Get a specific show
router.get('/theater/shows/:showId', getShowById);

// Get all shows for a theater
router.get('/theater/:theaterId/shows', getShowsByTheater);

// Get all shows for a movie
router.get('/theater/shows/movie/:movieId', getShowsByMovie);

export default router;