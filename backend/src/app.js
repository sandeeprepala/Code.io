import express from 'express';
import cors from 'cors';

import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
  // Specify the origin of the API. Set this to true if you want to allow any origin, or provide an array of allowed origins.
  origin: "https://code-io-wjsp-51k3pxxnm-sandeeprepala3-gmailcoms-projects.vercel.app", // Allow any origin to access the API
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
