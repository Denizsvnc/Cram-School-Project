import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { getPrismaClient } from './core/config/prisma';

const PORT = process.env.PORT || 3000;
const prisma = getPrismaClient();
import { startSalaryResetCron } from "./core/cron/salaryResetCron";

const sunucuBaslat = async ()=>{
    try {
        await prisma.$connect();
        console.log("Veritabanına Bağlanıldı");
        startSalaryResetCron();
        app.listen(PORT, () => {
            console.log(`Sunucu ${PORT} Portunda Başlatıldı`);
        });
    } catch (error) {
        console.error("Veritabanı bağlantı  hatası:", error);
    }
}

sunucuBaslat();