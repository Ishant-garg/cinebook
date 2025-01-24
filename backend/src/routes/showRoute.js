import express from 'express';
import {
  createShow,
  updateShow,
  deleteShow,
  getShowById,
  getShowsByTheater,
  getShowsByMovie,
  getShowsByCriteria,
  getSeatsByShow,
  getShowDetails,
  lockSeats,
  releaseSeats
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

// router.get('/shows' , getShowsByCriteria);
// Endpoint to fetch seats for a specific show
// router.get('/show/:id/seats', getSeatsByShow );


// Get show details
router.get('/shows/:id', getShowDetails);

// Lock seats
router.post('/shows/:id/lock-seats', lockSeats);

// Release seats
router.post('/shows/:id/release-seats', releaseSeats);


export default router;