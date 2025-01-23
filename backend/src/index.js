import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './lib/db.js'
import authRoute from './routes/authRoute.js'
import movieRoute from './routes/movieRoute.js'
import theaterRoute from './routes/theaterRoute.js'
dotenv.config()
import cors from 'cors'
const app = express()
const port = 3000
app.use(express.json())
app.use(cors())
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/api/auth" , authRoute ); 
app.use("/api/movie" , movieRoute ); 
app.use("/api/theater" , theaterRoute );

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  connectDB();
})
