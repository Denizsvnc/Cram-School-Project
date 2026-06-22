import { getPrismaClient } from '../../core/config/prisma';

export const izinTalebiOlustur = async (kullaniciId: string, baslangic: Date, bitis: Date, sebep: string) => {
    const prisma = getPrismaClient();
    const talep = await prisma.izinTalebi.create({
        data: {
            baslangic,
            bitis,
            sebep,
            kullaniciId,
            durum: "BEKLIYOR"
        }
    });
    return talep;
};

export const kullaniciIzinTalepleriniGetir = async (kullaniciId: string) => {
    const prisma = getPrismaClient();
    return await prisma.izinTalebi.findMany({
        where: { kullaniciId },
        orderBy: { createdAt: 'desc' }
    });
};

export const tumIzinTalepleriniGetir = async () => {
    const prisma = getPrismaClient();
    return await prisma.izinTalebi.findMany({
        include: {
            kullanici: {
                select: {
                    isim: true,
                    soy_isim: true,
                    rol: true,
                    mail: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};

export const izinTalebiDurumGuncelle = async (id: string, durum: string) => {
    const prisma = getPrismaClient();
    
    // İşlem yapılacak talebi getir
    const talep = await prisma.izinTalebi.findUnique({ where: { id }, include: { kullanici: true } });
    if (!talep) {
        throw new Error("İzin talebi bulunamadı.");
    }
    
    // Sadece BEKLIYOR durumundaki talepler ONAYLANDI veya REDDEDILDI olabilir
    if (talep.durum !== "BEKLIYOR") {
        throw new Error("Bu talep zaten sonuçlandırılmış.");
    }

    const guncellenenTalep = await prisma.izinTalebi.update({
        where: { id },
        data: { durum }
    });

    // Eğer onaylandıysa kullanilan_izin miktarını artır
    if (durum === "ONAYLANDI") {
        const baslangicTarihi = new Date(talep.baslangic);
        const bitisTarihi = new Date(talep.bitis);
        
        // Basit gün farkı hesaplama (brüt gün, tatilleri hesaplamadan dahil eder, +1 diyerek aynı gün alınan izin 1 gün sayılır)
        const farkMs = bitisTarihi.getTime() - baslangicTarihi.getTime();
        const gunFarki = Math.max(1, Math.ceil(farkMs / (1000 * 60 * 60 * 24)) + 1);

        const mevcutKullanilan = talep.kullanici.kullanilan_izin || 0;
        
        await prisma.kullanici.update({
            where: { id: talep.kullaniciId },
            data: { kullanilan_izin: mevcutKullanilan + gunFarki }
        });
    }

    return guncellenenTalep;
};
