import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './lib/db.js'
import authRoute from './routes/authRoute.js'
import movieRoute from './routes/movieRoute.js'
import theaterRoute from './routes/theaterRoute.js'
import showRoute from './routes/showRoute.js'
dotenv.config()
import cors from 'cors'
import { getTheatersByDateAndMovie } from './controllers/theater.controllers.js'
const app = express()
const port = 3000
const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps or Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow credentials (cookies)
  })
);
 // Allows all origins (use with caution)
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/api/auth" , authRoute ); 
app.use("/api/movie" , movieRoute ); 
app.use("/api/theater" , theaterRoute );
app.use("/api" , showRoute);
app.get("/api/theaters" , getTheatersByDateAndMovie)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  connectDB();
})
