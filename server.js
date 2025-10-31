import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import authRouter from './routes/authRoute.js';
import expenceRouter from './routes/expenceRoute.js';
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

// connect DB
connectDB();

app.use('/auth', authRouter);
app.use('/expence', expenceRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server Error' });
});

// get route
app.get('/', function(req, res){

   res.send('welcome to my expence tracker Backend');
});

const port = process.env.PORT || 6000;
app.listen(port, () => {
   console.log(`Server running on port ${port}`)
})





















