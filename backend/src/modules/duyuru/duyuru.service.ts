import { getPrismaClient } from '../../core/config/prisma';

const prisma = getPrismaClient();

export const DuyuruService = {
  async listAll() {
    return prisma.duyuru.findMany({
      orderBy: { tarih: 'desc' },
      include: {
        yazar: {
          select: {
            id: true,
            isim: true,
            soy_isim: true,
            rol: true
          }
        }
      }
    });
  },

  async listForRole(rol: string) {
    return prisma.duyuru.findMany({
      where: {
        OR: [
          { hedefRol: 'HEPSI' },
          { hedefRol: rol }
        ]
      },
      orderBy: { tarih: 'desc' },
      include: {
        yazar: {
          select: {
            id: true,
            isim: true,
            soy_isim: true,
            rol: true
          }
        }
      }
    });
  },

  async create(yazarId: string, baslik: string, icerik: string, hedefRol: string) {
    return prisma.duyuru.create({
      data: {
        baslik,
        icerik,
        hedefRol,
        yazarId
      },
      include: {
        yazar: {
          select: {
            id: true,
            isim: true,
            soy_isim: true,
            rol: true
          }
        }
      }
    });
  },

  async delete(id: string) {
    return prisma.duyuru.delete({
      where: { id }
    });
  }
};
