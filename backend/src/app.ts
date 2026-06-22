import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Middleware importları
import { errorHandler } from './core/middlewares/errorHandler';
import authRoutes from './modules/auth/auth.routes';

// modül route importları
import kullaniciRoutes from './modules/kullanici/kullanici.routes';
import sinifRoutes from './modules/sinif/sinif.routes';
import dersProgramiRoutes from './modules/ders_programi/dersProgrami.routes';
import yoklamaRoutes from './modules/yoklama/yoklama.routes';
import sinavNotuRoutes from './modules/sinavNotu/sinavNotu.routes';
import { odemeRouter } from './modules/odeme/odeme.route';
import duyuruRoutes from './modules/duyuru/duyuru.routes';
import odevRoutes from './modules/odev/odev.routes';
import gorusmeRoutes from './modules/gorusme/gorusme.routes';
import dersRoutes from './modules/ders/ders.routes';
import izinRoutes from './modules/izin/izin.routes';
const app: Application = express();


// Tauri, Electron ve web origin'leri dahil — tüm client ortamlarını destekle
const originsEnv = process.env.FRONTEND_ORIGINS ?? 'http://localhost:5173,http://localhost:3000,file://,tauri://localhost,http://tauri.localhost,https://tauri.localhost';
let corsOrigin: string | string[] | boolean = originsEnv.split(',').map((origin) => origin.trim()).filter(Boolean);

if (originsEnv === '*') {
    corsOrigin = true;
}

app.use(cors({
  origin: (origin, callback) => {
    // Tauri ve Electron file:// veya null origin ile istek atar
    if (!origin || origin === 'null') {
      return callback(null, true);
    }
    // Tauri WebView origin'leri
    if (origin.includes('tauri.localhost') || origin.startsWith('tauri://')) {
      return callback(null, true);
    }
    // Normal origin listesi kontrolü
    const allowedOrigins = Array.isArray(corsOrigin) ? corsOrigin : [];
    if (allowedOrigins.includes(origin) || corsOrigin === true) {
      return callback(null, true);
    }
    // Geliştirme ortamında localhost'a izin ver
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    callback(new Error(`CORS policy: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
}));
app.use(express.json());
app.use(cookieParser());

// health check endpoint
app.get('/saglik', (req: Request, res: Response) => {
    res.status(200).json({ message: "Sunucu Sağlıklı Şekilde Çalışıyor!" });
});

app.use('/auth', authRoutes);

// korumalı routelar requireAuth middleware'ini kullanir

app.use('/kullanici', kullaniciRoutes);
app.use('/sinif', sinifRoutes);
app.use('/ders-programi', dersProgramiRoutes);
app.use('/yoklama', yoklamaRoutes);
app.use('/sinav-notu', sinavNotuRoutes);
app.use('/odeme', odemeRouter);
app.use('/duyuru', duyuruRoutes);
app.use('/odev', odevRoutes);
app.use('/gorusme', gorusmeRoutes);
app.use('/ders', dersRoutes);
app.use('/izin', izinRoutes);

app.use(errorHandler);

export default app;