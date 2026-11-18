import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import assessmentRoutes from './routes/assessments.js';
import chatRoutes from './routes/chat.js';
import privacyRoutes from './routes/privacy.js';
import './db.js';
if(!process.env.JWT_SECRET||process.env.JWT_SECRET.length<32)throw new Error('JWT_SECRET must contain at least 32 characters.');
const app=express();
app.disable('x-powered-by');
app.use(helmet({crossOriginResourcePolicy:{policy:'same-site'}}));
app.use(cors({origin:process.env.CLIENT_ORIGIN||'http://localhost:5173',credentials:true}));
app.use(express.json({limit:'30kb'}));
app.use(cookieParser());
app.use('/api/auth',rateLimit({windowMs:15*60_000,limit:30,standardHeaders:true,legacyHeaders:false}),authRoutes);
app.use('/api/assessments',assessmentRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/privacy',privacyRoutes);
app.get('/api/health',(_,res)=>res.json({ok:true,service:'CareerPath API'}));

// In production, serve the Vite build from the same origin as the API.
// This keeps HttpOnly authentication cookies first-party and avoids cross-origin setup.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientBuild = path.resolve(__dirname, '../dist');
app.use(express.static(clientBuild));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(clientBuild, 'index.html'), (err) => {
    if (err) next(err);
  });
});
app.use((err,req,res,next)=>{console.error('API error:',err.message);res.status(500).json({error:'Đã có lỗi xảy ra.'});});
const port=Number(process.env.PORT||4000);
app.listen(port,()=>console.log(`CareerPath API listening on ${port}`));
