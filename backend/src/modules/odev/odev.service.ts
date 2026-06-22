import { getPrismaClient } from '../../core/config/prisma';

const prisma = getPrismaClient();

export const OdevService = {
  // --- Ödev Metotları ---

  async createOdev(
    ogretmenId: string,
    baslik: string,
    aciklama: string,
    teslimTarihi: Date,
    sinifId: string,
    dersId: string
  ) {
    // 1. Ödevi oluştur
    const odev = await prisma.odev.create({
      data: {
        baslik,
        aciklama,
        teslimTarihi,
        sinifId,
        dersId,
        ogretmenId
      },
      include: {
        sinif: true,
        ders: true
      }
    });

    // 2. Sınıftaki tüm öğrencileri bul
    const ogrenciler = await prisma.kullanici.findMany({
      where: {
        sinifId,
        rol: 'OGRENCI',
        aktifMi: true
      }
    });

    // 3. Her öğrenci için boş bir OdevTeslim kaydı oluştur
    if (ogrenciler.length > 0) {
      await prisma.odevTeslim.createMany({
        data: ogrenciler.map(ogrenci => ({
          odevId: odev.id,
          ogrenciId: ogrenci.id,
          tamamlandi: false
        }))
      });
    }

    return odev;
  },

  async listOdevlerByOgretmen(ogretmenId: string) {
    return prisma.odev.findMany({
      where: { ogretmenId },
      orderBy: { createdAt: 'desc' },
      include: {
        sinif: true,
        ders: true,
        teslimler: {
          include: {
            ogrenci: {
              select: {
                id: true,
                isim: true,
                soy_isim: true,
                kimlikNo: true
              }
            }
          }
        }
      }
    });
  },

  async listOdevlerBySinif(sinifId: string, ogrenciId: string) {
    return prisma.odev.findMany({
      where: { sinifId },
      orderBy: { teslimTarihi: 'asc' },
      include: {
        ders: true,
        ogretmen: {
          select: {
            isim: true,
            soy_isim: true
          }
        },
        teslimler: {
          where: { ogrenciId }
        }
      }
    });
  },

  async getOdevTeslimler(odevId: string) {
    return prisma.odevTeslim.findMany({
      where: { odevId },
      include: {
        ogrenci: {
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

  async toggleTeslimDurumu(odevId: string, ogrenciId: string, tamamlandi: boolean) {
    // Önce kaydın varlığını kontrol et
    const teslim = await prisma.odevTeslim.findFirst({
      where: { odevId, ogrenciId }
    });

    if (teslim) {
      return prisma.odevTeslim.update({
        where: { id: teslim.id },
        data: {
          tamamlandi,
          tamamlanmaTarihi: tamamlandi ? new Date() : null
        }
      });
    } else {
      // Yoksa (sınıf değişmiş vs. olabilir) yeni kayıt oluştur
      return prisma.odevTeslim.create({
        data: {
          odevId,
          ogrenciId,
          tamamlandi,
          tamamlanmaTarihi: tamamlandi ? new Date() : null
        }
      });
    }
  },

  async updateTeslimByTeacher(teslimId: string, tamamlandi: boolean) {
    return prisma.odevTeslim.update({
      where: { id: teslimId },
      data: {
        tamamlandi,
        tamamlanmaTarihi: tamamlandi ? new Date() : null
      }
    });
  },

  async deleteOdev(id: string) {
    return prisma.odev.delete({
      where: { id }
    });
  },

  // --- Materyal Metotları ---

  async createMateryal(
    ogretmenId: string,
    baslik: string,
    aciklama: string | undefined,
    dosyaUrl: string,
    sinifId: string,
    dersId: string
  ) {
    return prisma.dersMateryali.create({
      data: {
        baslik,
        aciklama: aciklama ?? null,
        dosyaUrl,
        sinifId,
        dersId,
        ogretmenId
      },
      include: {
        sinif: true,
        ders: true
      }
    });
  },

  async listMateryalBySinif(sinifId: string) {
    return prisma.dersMateryali.findMany({
      where: { sinifId },
      orderBy: { createdAt: 'desc' },
      include: {
        ders: true,
        ogretmen: {
          select: {
            isim: true,
            soy_isim: true
          }
        }
      }
    });
  },

  async listMateryalByOgretmen(ogretmenId: string) {
    return prisma.dersMateryali.findMany({
      where: { ogretmenId },
      orderBy: { createdAt: 'desc' },
      include: {
        sinif: true,
        ders: true
      }
    });
  },

  async deleteMateryal(id: string) {
    return prisma.dersMateryali.delete({
      where: { id }
    });
  }
};
