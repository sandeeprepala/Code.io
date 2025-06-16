import express from 'express';
import cors from 'cors';

import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true             
}));



app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser()); // Middleware to parse cookies

//import routes
import userRouter from './routes/userRoute.js';
import problemRouter from './routes/problemRoute.js';
import submissionRouter from './routes/submissionRoute.js';


//use routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/problems', problemRouter);
app.use('/api/v1/submissions', submissionRouter);
export {app};
