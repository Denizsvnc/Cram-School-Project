import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
// Modül importları
import authRoutes from './modules/auth/auth.routes';
const app: Application = express();
app.use(express.json());
app.use(cors());

// Modül routelarını belirt
app.use('/', authRoutes);

app.get('/saglik', (req: Request, res: Response) => {
    res.status(200).json({message: "Sunucu Sağlıklı Şekilde Çalışıyor!"});
});

export default app;
