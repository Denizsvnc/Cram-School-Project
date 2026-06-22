import { getPrismaClient } from '../../core/config/prisma';

const prisma = getPrismaClient();

export const OdemeService = {
  async getOdemelerByKullaniciId(kullaniciId: string) {
    return prisma.odeme.findMany({
      where: { kullaniciId },
      orderBy: { tarih: 'desc' },
    });
  },

  async getBekleyenOdemeler() {
    return prisma.odeme.findMany({
      orderBy: { tarih: 'desc' },
      include: { kullanici: true }
    });
  },

  async odemeYap(id: string) {
    return prisma.odeme.update({
      where: { id },
      data: { durum: 'BEKLIYOR' },
    });
  },

  async odemeOnayla(id: string) {
    return prisma.odeme.update({
      where: { id },
      data: { durum: 'ONAYLANDI', sonOdemeTarihi: new Date() },
    });
  },

  async getFinansalOzet() {
    // 1. Ödemelerden gelirleri hesapla
    const odemeler = await prisma.odeme.findMany();
    
    let toplamGelir = 0; // ONAYLANDI veya ODENDI
    let bekleyenGelir = 0; // BEKLIYOR
    
    for (const o of odemeler) {
      if (o.durum === 'ONAYLANDI' || o.durum === 'ODENDI') {
        toplamGelir += o.miktar;
      } else if (o.durum === 'BEKLIYOR') {
        bekleyenGelir += o.miktar;
      }
    }

    // 2. Personel maaş giderlerini hesapla (aktif kullanıcılar)
    const personeller = await prisma.kullanici.findMany({
      where: {
        rol: {
          in: ['OGRETMEN', 'MUDUR', 'PERSONEL']
        },
        aktifMi: true
      },
      select: {
        maas: true,
        maas_odendi_mi: true
      }
    });

    let aylikMaasGideri = 0;
    let odenenMaas = 0;
    let bekleyenMaas = 0;

    for (const p of personeller) {
      const maasTutar = p.maas ? parseFloat(p.maas) : 0;
      if (!isNaN(maasTutar)) {
        aylikMaasGideri += maasTutar;
        if (p.maas_odendi_mi === true) {
          odenenMaas += maasTutar;
        } else {
          bekleyenMaas += maasTutar;
        }
      }
    }

    return {
      toplamGelir,
      bekleyenGelir,
      aylikMaasGideri,
      odenenMaas,
      bekleyenMaas,
      netBakiye: toplamGelir - odenenMaas
    };
  }
};
