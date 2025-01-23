import express from "express";
import {
  createTheater,
  getAllTheaters,
  getTheaterById,
  updateTheater,
  deleteTheater,
  getTheatersByMovie,
} from  "../controllers/theater.controllers.js";
import {protectRoute} from  "../middlewares/auth.middleware.js";
import isAdmin from  "../middlewares/isAdmin.middleware.js";

const router = express.Router();

// Create a theater (Admin only)
router.post("/", protectRoute, isAdmin, createTheater);

// Get all theaters
router.get("/", getAllTheaters);

// Get a specific theater by ID
router.get("/:id", getTheaterById);

// Update a theater (Admin only)
router.put("/:id", protectRoute, isAdmin, updateTheater);

// Delete a theater (Admin only)
router.delete("/:id", protectRoute, isAdmin, deleteTheater);

// Get all theaters showing a specific movie
router.get("/movie/:movieId", getTheatersByMovie);

export default router;
