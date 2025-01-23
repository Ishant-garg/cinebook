import express from "express";
import {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} from "../controllers/movie.controllers.js";
 
import isAdmin from "../middlewares/isAdmin.middleware.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

 
router.post("/", protectRoute, isAdmin, createMovie);
router.get("/", getAllMovies);
router.get("/:id", getMovieById); 
router.put("/:id", protectRoute, isAdmin, updateMovie);
router.delete("/:id", protectRoute, isAdmin, deleteMovie);

export default router;
