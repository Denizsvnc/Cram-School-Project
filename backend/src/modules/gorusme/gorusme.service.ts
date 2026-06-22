import { getPrismaClient } from '../../core/config/prisma';

const prisma = getPrismaClient();

export const GorusmeService = {
  // --- Sınav Takvimi Metotları ---

  async listSinavTakvimi() {
    return prisma.sinavTakvimi.findMany({
      orderBy: { tarih: 'asc' },
      include: {
        ders: true
      }
    });
  },

  async createSinavTakvimi(sinavAdi: string, tarih: Date, dersId: string) {
    return prisma.sinavTakvimi.create({
      data: {
        sinavAdi,
        tarih,
        dersId
      },
      include: {
        ders: true
      }
    });
  },

  async deleteSinavTakvimi(id: string) {
    return prisma.sinavTakvimi.delete({
      where: { id }
    });
  },

  // --- Veli Görüşme Metotları ---

  async listVeliGorusmeleriByVeli(veliId: string) {
    return prisma.veliGorusme.findMany({
      where: { veliId },
      orderBy: { tarih: 'asc' },
      include: {
        ogretmen: {
          select: {
            id: true,
            isim: true,
            soy_isim: true,
            kimlikNo: true
          }
        }
      }
    });
  },

  async listVeliGorusmeleriByOgretmen(ogretmenId: string) {
    return prisma.veliGorusme.findMany({
      where: { ogretmenId },
      orderBy: { tarih: 'asc' },
      include: {
        veli: {
          select: {
            id: true,
            isim: true,
            soy_isim: true,
            kimlikNo: true,
            tel_no: true
          }
        }
      }
    });
  },

  async listAllVeliGorusmeleri() {
    return prisma.veliGorusme.findMany({
      orderBy: { tarih: 'asc' },
      include: {
        veli: {
          select: {
            id: true,
            isim: true,
            soy_isim: true,
            kimlikNo: true
          }
        },
        ogretmen: {
          select: {
            id: true,
            isim: true,
            soy_isim: true,
            kimlikNo: true
          }
        }
      }
    });
  },

  async createVeliGorusme(
    veliId: string,
    ogretmenId: string,
    tarih: Date,
    saat: string,
    aciklama: string | undefined
  ) {
    return prisma.veliGorusme.create({
      data: {
        veliId,
        ogretmenId,
        tarih,
        saat,
        aciklama: aciklama ?? null,
        durum: 'BEKLIYOR'
      },
      include: {
        ogretmen: {
          select: {
            isim: true,
            soy_isim: true
          }
        }
      }
    });
  },

  async updateVeliGorusmeDurum(id: string, durum: string) {
    return prisma.veliGorusme.update({
      where: { id },
      data: { durum }
    });
  },

  async deleteVeliGorusme(id: string) {
    return prisma.veliGorusme.delete({
      where: { id }
    });
  }
};
