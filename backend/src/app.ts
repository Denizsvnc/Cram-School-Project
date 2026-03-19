import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Modül importları
import authRoutes from './modules/auth/auth.routes';
import { errorHandler } from './core/middlewares/errorHandler';
import kullaniciRoutes from './modules/kullanici/kullanici.routes';
import sinifRoutes from './modules/sinif/sinif.routes';
const app: Application = express();

const frontendOrigins = (process.env.FRONTEND_ORIGINS ?? 'http://localhost:5173,http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
app.use(
    cors({
        origin: frontendOrigins,
        credentials: true
    })
);

app.use(express.json());
app.use(cookieParser());

// Modül routelarını belirt
app.use('/', authRoutes);
app.use(errorHandler);

app.use('/kullanici', kullaniciRoutes);
app.use('/sinif', sinifRoutes);


app.get('/saglik', (req: Request, res: Response) => {
    res.status(200).json({message: "Sunucu Sağlıklı Şekilde Çalışıyor!"});
});

export default app;
