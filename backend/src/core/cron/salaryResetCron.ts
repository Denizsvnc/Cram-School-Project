import { getPrismaClient } from '../config/prisma';
import { Roller } from '../../../generated/prisma/enums';

export async function maasDurumlariniOtomatikSifirla() {
  const prisma = getPrismaClient();
  try {
    const result = await prisma.kullanici.updateMany({
      where: {
        rol: {
          in: [Roller.MUDUR, Roller.OGRETMEN, Roller.PERSONEL]
        },
        aktifMi: true,
        maas_odendi_mi: true
      },
      data: {
        maas_odendi_mi: false
      }
    });
    if (result.count > 0) {
      console.log(`[Cron] Otomatik Maaş Sıfırlama: ${result.count} aktif personelin maaş ödeme durumu 'Ödenmedi' olarak sıfırlanıldı.`);
    }
  } catch (error) {
    console.error("[Cron] Otomatik maaş sıfırlama işlemi sırasında hata:", error);
  }
}

export function startSalaryResetCron() {
  console.log("[Cron] Maaş sıfırlama cron görevi kuruldu. 12 saatte bir kontrol edilecek.");

  const checkAndReset = async () => {
    const today = new Date();
    // Ayın 1'i ise çalıştır
    if (today.getDate() === 1) {
      console.log(`[Cron] Ayın 1. günü tespit edildi. Otomatik maaş ödeme durumları sıfırlanıyor...`);
      await maasDurumlariniOtomatikSifirla();
    }
  };

  // Sunucu başladığında kontrol et (Eğer bugün ayın 1'iyse sıfırla)
  void checkAndReset();

  // 12 saatte bir kontrol et (Gün geçişlerini yakalamak için güvenli ve hafiftir)
  setInterval(() => {
    void checkAndReset();
  }, 12 * 60 * 60 * 1000); 
}
