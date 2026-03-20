import bcrypt from 'bcrypt';
import { getPrismaClient } from '../src/core/config/prisma';
import dotenv from 'dotenv';
dotenv.config();

const SALT_ROUNDS = 10;

async function main() {
  const prisma = getPrismaClient();

  const sifreHash = await bcrypt.hash('123456', SALT_ROUNDS);

  console.log('Seed başlatılıyor...');

  // Mevcut en yüksek numaraları bul
  const sonPersonel = await prisma.kullanici.findFirst({
    where: { personelNo: { not: null } },
    orderBy: { personelNo: 'desc' },
    select: { personelNo: true },
  });
  const sonOgrenci = await prisma.kullanici.findFirst({
    where: { ogrenciNo: { not: null } },
    orderBy: { ogrenciNo: 'desc' },
    select: { ogrenciNo: true },
  });

  let personelNo = (sonPersonel?.personelNo ?? 0) + 1;
  let ogrenciNo = (sonOgrenci?.ogrenciNo ?? 0) + 1;

  // --- YÖNETİCİ ---
  const yonetici = await prisma.kullanici.upsert({
    where: { mail: 'admin@dershane.com' },
    update: {},
    create: {
      isim: 'Admin',
      soy_isim: 'Yönetici',
      tel_no: '05001112233',
      mail: 'admin@dershane.com',
      sifre: sifreHash,
      tc_no: '10000000001',
      dogum_tarihi: new Date('1985-01-15'),
      rol: 'YONETICI',
      egitim_durumu: 'Lisans',
      maas: '25000',
    },
  });
  console.log(`✅ Yönetici: ${yonetici.mail}`);

  // --- ÖĞRETMENLER ---
  const ogretmenler = [
    {
      isim: 'Ahmet',
      soy_isim: 'Kaya',
      tel_no: '05301112233',
      mail: 'ahmet.kaya@dershane.com',
      tc_no: '20000000001',
      dogum_tarihi: new Date('1990-05-20'),
      egitim_durumu: 'Yüksek Lisans',
      maas: '18000',
    },
    {
      isim: 'Fatma',
      soy_isim: 'Demir',
      tel_no: '05351112233',
      mail: 'fatma.demir@dershane.com',
      tc_no: '20000000002',
      dogum_tarihi: new Date('1992-11-10'),
      egitim_durumu: 'Lisans',
      maas: '17000',
    },
  ];

  for (const ogretmen of ogretmenler) {
    const mevcut = await prisma.kullanici.findUnique({ where: { mail: ogretmen.mail } });
    if (mevcut) {
      console.log(`⏭️  Öğretmen zaten mevcut: ${ogretmen.mail}`);
      continue;
    }
    const created = await prisma.kullanici.create({
      data: {
        ...ogretmen,
        sifre: sifreHash,
        rol: 'OGRETMEN',
        personelNo: personelNo++,
      },
    });
    console.log(`✅ Öğretmen: ${created.mail} (personelNo: ${created.personelNo})`);
  }

  // --- ÖĞRENCİLER ---
  const ogrenciler = [
    {
      isim: 'Mehmet',
      soy_isim: 'Yılmaz',
      tel_no: '05401112233',
      mail: 'mehmet.yilmaz@ogrenci.com',
      tc_no: '30000000001',
      dogum_tarihi: new Date('2007-03-12'),
      egitim_durumu: 'Lise',
    },
    {
      isim: 'Ayşe',
      soy_isim: 'Çelik',
      tel_no: '05411112233',
      mail: 'ayse.celik@ogrenci.com',
      tc_no: '30000000002',
      dogum_tarihi: new Date('2008-07-25'),
      egitim_durumu: 'Lise',
    },
    {
      isim: 'Can',
      soy_isim: 'Özkan',
      tel_no: '05421112233',
      mail: 'can.ozkan@ogrenci.com',
      tc_no: '30000000003',
      dogum_tarihi: new Date('2007-09-05'),
      egitim_durumu: 'Lise',
    },
    {
      isim: 'Zeynep',
      soy_isim: 'Arslan',
      tel_no: '05431112233',
      mail: 'zeynep.arslan@ogrenci.com',
      tc_no: '30000000004',
      dogum_tarihi: new Date('2008-01-18'),
      egitim_durumu: 'Lise',
    },
    {
      isim: 'Burak',
      soy_isim: 'Şahin',
      tel_no: '05441112233',
      mail: 'burak.sahin@ogrenci.com',
      tc_no: '30000000005',
      dogum_tarihi: new Date('2007-12-30'),
      egitim_durumu: 'Lise',
    },
  ];

  for (const ogrenci of ogrenciler) {
    const mevcut = await prisma.kullanici.findUnique({ where: { mail: ogrenci.mail } });
    if (mevcut) {
      console.log(`⏭️  Öğrenci zaten mevcut: ${ogrenci.mail}`);
      continue;
    }
    const created = await prisma.kullanici.create({
      data: {
        ...ogrenci,
        sifre: sifreHash,
        rol: 'OGRENCI',
        ogrenciNo: ogrenciNo++,
        odeme_plani: 'Aylık',
        odeme_durumu: true,
      },
    });
    console.log(`✅ Öğrenci: ${created.mail} (ogrenciNo: ${created.ogrenciNo})`);
  }

  // --- MÜDÜR ---
  const mudurMail = 'mudur@dershane.com';
  const mevcutMudur = await prisma.kullanici.findUnique({ where: { mail: mudurMail } });
  if (!mevcutMudur) {
    const createdMudur = await prisma.kullanici.create({
      data: {
        isim: 'Leyla',
        soy_isim: 'Aydın',
        tel_no: '05552223344',
        mail: mudurMail,
        sifre: sifreHash,
        tc_no: '40000000001',
        dogum_tarihi: new Date('1980-08-20'),
        rol: 'MUDUR',
        personelNo: personelNo++,
        egitim_durumu: 'Doktora',
        maas: '35000',
      },
    });
    console.log(`✅ Müdür: ${createdMudur.mail} (personelNo: ${createdMudur.personelNo})`);
  }

  // --- VELİLER ---
  const veliler = [
    {
      isim: 'Hasan',
      soy_isim: 'Yılmaz',
      tel_no: '05661112233',
      mail: 'hasan.yilmaz@veli.com',
      tc_no: '50000000001',
      dogum_tarihi: new Date('1975-04-10'),
      egitim_durumu: 'Üniversite',
    },
  ];

  for (const veli of veliler) {
    const mevcut = await prisma.kullanici.findUnique({ where: { mail: veli.mail } });
    if (mevcut) {
      console.log(`⏭️  Veli zaten mevcut: ${veli.mail}`);
      continue;
    }
    const created = await prisma.kullanici.create({
      data: {
        ...veli,
        sifre: sifreHash,
        rol: 'VELI',
      },
    });
    console.log(`✅ Veli: ${created.mail}`);
  }

  // --- DİĞER PERSONELLER ---
  const digerPersoneller = [
    {
      isim: 'Murat',
      soy_isim: 'Demir',
      tel_no: '05771112233',
      mail: 'murat.demir@personel.com',
      tc_no: '60000000001',
      dogum_tarihi: new Date('1988-11-25'),
      egitim_durumu: 'Lise',
      maas: '15000',
    },
  ];

  for (const p of digerPersoneller) {
    const mevcut = await prisma.kullanici.findUnique({ where: { mail: p.mail } });
    if (mevcut) {
      console.log(`⏭️  Personel zaten mevcut: ${p.mail}`);
      continue;
    }
    const created = await prisma.kullanici.create({
      data: {
        ...p,
        sifre: sifreHash,
        rol: 'PERSONEL',
        personelNo: personelNo++,
      },
    });
    console.log(`✅ Personel: ${created.mail} (personelNo: ${created.personelNo})`);
  }

  console.log('\n🎉 Seed tamamlandı!');
}

main()
  .catch((e) => {
    console.error('Seed hatası:', e);
    process.exit(1);
  });
