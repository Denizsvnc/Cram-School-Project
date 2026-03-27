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
  }
};
