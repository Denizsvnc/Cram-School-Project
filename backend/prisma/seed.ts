import bcrypt from 'bcrypt';
import { getPrismaClient } from '../src/core/config/prisma';
import dotenv from 'dotenv';
dotenv.config();

const SALT_ROUNDS = 10;

async function main() {
  const prisma = getPrismaClient();

  const sifreHash = await bcrypt.hash('123456', SALT_ROUNDS);

  console.log('Seed başlatılıyor...');

  // Database cleanup to prevent constraints violations
  await prisma.session.deleteMany();
  await prisma.odeme.deleteMany();
  await prisma.yoklama.deleteMany();
  await prisma.sinavNotu.deleteMany();
  await prisma.dersProgrami.deleteMany();
  await prisma.duyuru.deleteMany();
  await prisma.odevTeslim.deleteMany();
  await prisma.odev.deleteMany();
  await prisma.dersMateryali.deleteMany();
  await prisma.sinavTakvimi.deleteMany();
  await prisma.veliGorusme.deleteMany();
  await prisma.kullanici.deleteMany();
  await prisma.sinif.deleteMany();
  await prisma.ders.deleteMany();

  let nextKimlikNo = 100001;
  let personelNo = 1;
  let ogrenciNo = 1;

  // --- YÖNETİCİ ---
  const yonetici = await prisma.kullanici.upsert({
    where: { mail: 'admin@mail.com' },
    update: {},
    create: {
      isim: 'Admin',
      soy_isim: 'Yönetici',
      tel_no: '05001112233',
      mail: 'admin@mail.com',
      sifre: sifreHash,
      tc_no: '10000000001',
      dogum_tarihi: new Date('1985-01-15'),
      rol: 'YONETICI',
      egitim_durumu: 'Lisans',
      maas: '25000',
      kimlikNo: nextKimlikNo++,
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
    const created = await prisma.kullanici.create({
      data: {
        ...ogretmen,
        sifre: sifreHash,
        rol: 'OGRETMEN',
        personelNo: personelNo++,
        kimlikNo: nextKimlikNo++,
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
    const created = await prisma.kullanici.create({
      data: {
        ...ogrenci,
        sifre: sifreHash,
        rol: 'OGRENCI',
        ogrenciNo: ogrenciNo++,
        odeme_plani: 'Aylık',
        odeme_durumu: true,
        kimlikNo: nextKimlikNo++,
      },
    });
    console.log(`✅ Öğrenci: ${created.mail} (ogrenciNo: ${created.ogrenciNo})`);
  }

  // --- MÜDÜR ---
  const mudurMail = 'mudur@dershane.com';
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
      kimlikNo: nextKimlikNo++,
    },
  });
  console.log(`✅ Müdür: ${createdMudur.mail} (personelNo: ${createdMudur.personelNo})`);

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
    const created = await prisma.kullanici.create({
      data: {
        ...veli,
        sifre: sifreHash,
        rol: 'VELI',
        kimlikNo: nextKimlikNo++,
      },
    });
    console.log(`✅ Veli: ${created.mail}`);
  }

  // Mehmet Yılmaz öğrencisini velisi Hasan Yılmaz ile ilişkilendir
  const veliHasanObj = await prisma.kullanici.findUnique({ where: { mail: 'hasan.yilmaz@veli.com' } });
  if (veliHasanObj) {
    await prisma.kullanici.update({
      where: { mail: 'mehmet.yilmaz@ogrenci.com' },
      data: { veli_ID: veliHasanObj.id }
    });
    console.log(`✅ Mehmet Yılmaz velisi Hasan Yılmaz olarak güncellendi.`);
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
    const created = await prisma.kullanici.create({
      data: {
        ...p,
        sifre: sifreHash,
        rol: 'PERSONEL',
        personelNo: personelNo++,
        kimlikNo: nextKimlikNo++,
      },
    });
    console.log(`✅ Personel: ${created.mail} (personelNo: ${created.personelNo})`);
  }


  // --- SINIFLAR ---
  const sinif12A = await prisma.sinif.upsert({
    where: { isim: '12-A Sayısal' },
    update: {},
    create: { isim: '12-A Sayısal', kapasite: 20 },
  });
  console.log(`✅ Sınıf eklendi: ${sinif12A.isim}`);

  // --- DERSLER ---
  const dersMat = await prisma.ders.upsert({
    where: { isim: 'Matematik' },
    update: {},
    create: { isim: 'Matematik', ders_suresi: 40 },
  });
  const dersFizik = await prisma.ders.upsert({
    where: { isim: 'Fizik' },
    update: {},
    create: { isim: 'Fizik', ders_suresi: 40 },
  });
  console.log(`✅ Dersler eklendi: Matematik, Fizik`);

  // --- DERS PROGRAMI ---
  const ogretmenAhmet = await prisma.kullanici.findUnique({ where: { mail: 'ahmet.kaya@dershane.com' } });
  if (ogretmenAhmet) {
    // Check if a program already exists to avoid duplicates
    const existingProgram = await prisma.dersProgrami.findFirst({
      where: {
        sinifId: sinif12A.id,
        dersId: dersMat.id,
        ogretmenId: ogretmenAhmet.id,
      }
    });

    if (!existingProgram) {
      await prisma.dersProgrami.create({
        data: {
          gun: 1, // Pazartesi
          baslangic: '09:00',
          bitis: '09:40',
          sinifId: sinif12A.id,
          dersId: dersMat.id,
          ogretmenId: ogretmenAhmet.id,
        },
      });
      console.log(`✅ Ders Programı eklendi: Matematik (Pazartesi 09:00 - Ahmet Kaya)`);
    } else {
      console.log(`⏭️  Ders Programı zaten mevcut`);
    }
  }

  // --- ÖĞRENCİLERİ SINIFA ATA ---
  await prisma.kullanici.updateMany({
    where: { rol: 'OGRENCI', sinifId: null },
    data: { sinifId: sinif12A.id },
  });
  console.log(`✅ Atanmamış öğrenciler 12-A sınıfına atandı.`);

  // --- ÖDEMELER ---
  const ogrencilerYeni = await prisma.kullanici.findMany({ where: { rol: 'OGRENCI' } });
  for (const ogrenci of ogrencilerYeni) {
    const existingOdeme = await prisma.odeme.findFirst({ where: { kullaniciId: ogrenci.id } });
    if (!existingOdeme) {
      await prisma.odeme.createMany({
        data: [
          { kullaniciId: ogrenci.id, miktar: 2500, durum: 'ODENDI', aciklama: '1. Taksit (Eylül)' },
          { kullaniciId: ogrenci.id, miktar: 2500, durum: 'ONAYLANDI', aciklama: '2. Taksit (Ekim)' },
          { kullaniciId: ogrenci.id, miktar: 2500, durum: 'BEKLIYOR', aciklama: '3. Taksit (Kasım)' },
          { kullaniciId: ogrenci.id, miktar: 2500, durum: 'BEKLIYOR', aciklama: '4. Taksit (Aralık) - Güncel', sonOdemeTarihi: new Date() }
        ]
      });
    }
  }
  console.log(`✅ Ödemeler örneği oluşturuldu.`);

  // --- DUYURULAR, ÖDEVLER, MATERYALLER, SINAVLAR VE VELİ GÖRÜŞMELERİ ÖRNEK VERİLERİ ---
  console.log('\nYeni modüller için örnek veriler ekleniyor...');

  const ogretmenFatma = await prisma.kullanici.findFirst({ where: { mail: 'fatma.demir@dershane.com' } });
  const veliHasan = await prisma.kullanici.findFirst({ where: { mail: 'hasan.yilmaz@veli.com' } });
  const ogrenciMehmet = await prisma.kullanici.findFirst({ where: { mail: 'mehmet.yilmaz@ogrenci.com' } });
  const ogrenciAyse = await prisma.kullanici.findFirst({ where: { mail: 'ayse.celik@ogrenci.com' } });

  const bugun = new Date();

  // 1. DUYURULAR
  if (yonetici) {
    await prisma.duyuru.createMany({
      data: [
        {
          baslik: '2026-2027 Eğitim Öğretim Yılı Başlıyor!',
          icerik: 'Yeni eğitim dönemimiz 7 Eylül 2026 tarihinde başlayacaktır. Tüm öğrencilerimize ve öğretmenlerimize şimdiden başarılar dileriz.',
          hedefRol: 'HEPSI',
          yazarId: yonetici.id,
          tarih: new Date(bugun.getTime() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          baslik: 'Öğretmenler Zümre Toplantısı',
          icerik: 'Haftalık zümre toplantısı Cuma günü saat 17:00\'de öğretmenler odasında gerçekleştirilecektir. Katılım zorunludur.',
          hedefRol: 'OGRETMEN',
          yazarId: yonetici.id,
          tarih: new Date(bugun.getTime() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          baslik: 'Veli Bilgilendirme Semineri',
          icerik: 'Öğrencilerimizin sınav hazırlık süreçleri ve motivasyon yönetimi üzerine velilerimize özel seminerimiz bu Cumartesi saat 14:00\'te konferans salonunda yapılacaktır.',
          hedefRol: 'VELI',
          yazarId: yonetici.id,
          tarih: bugun
        }
      ]
    });
    console.log('✅ Duyuru örnekleri oluşturuldu.');
  }

  // 2. DERS MATERYALLERİ
  if (sinif12A && ogretmenAhmet && dersMat) {
    await prisma.dersMateryali.create({
      data: {
        baslik: 'Trigonometri Formül Kağıdı ve Soru Çözümleri',
        aciklama: '12. Sınıf Matematik dersi Trigonometri ünitesi formül özeti ve örnek soru çözümleri içeren PDF dökümanı.',
        dosyaUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        sinifId: sinif12A.id,
        dersId: dersMat.id,
        ogretmenId: ogretmenAhmet.id
      }
    });
  }
  if (sinif12A && ogretmenFatma && dersFizik) {
    await prisma.dersMateryali.create({
      data: {
        baslik: 'Newton Hareket Yasaları Ders Notu',
        aciklama: 'Fizik Dersi - Newton Hareket Yasaları (Dinamik) temel prensipleri ve çözümlü soruları.',
        dosyaUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        sinifId: sinif12A.id,
        dersId: dersFizik.id,
        ogretmenId: ogretmenFatma.id
      }
    });
  }
  console.log('✅ Ders Materyalleri örnekleri oluşturuldu.');

  // 3. ÖDEVLER VE ÖDEV TESLİMLERİ
  if (sinif12A && ogretmenAhmet && dersMat) {
    const odev1 = await prisma.odev.create({
      data: {
        baslik: 'Logaritma ve Üstel Fonksiyonlar Ödev Sayfası',
        aciklama: 'Matematik soru bankası sayfa 110-115 arasındaki tüm testler çözülüp bitirilecek.',
        teslimTarihi: new Date(bugun.getTime() + 5 * 24 * 60 * 60 * 1000),
        sinifId: sinif12A.id,
        dersId: dersMat.id,
        ogretmenId: ogretmenAhmet.id
      }
    });

    if (ogrenciMehmet && ogrenciAyse) {
      await prisma.odevTeslim.createMany({
        data: [
          {
            odevId: odev1.id,
            ogrenciId: ogrenciMehmet.id,
            tamamlandi: true,
            tamamlanmaTarihi: new Date(bugun.getTime() - 4 * 60 * 60 * 1000)
          },
          {
            odevId: odev1.id,
            ogrenciId: ogrenciAyse.id,
            tamamlandi: false
          }
        ]
      });
    }
  }

  if (sinif12A && ogretmenFatma && dersFizik) {
    const odev2 = await prisma.odev.create({
      data: {
        baslik: 'Elektriksel Alan ve Potansiyel Soruları',
        aciklama: 'Verilen PDF çalışma yaprağındaki 20 soru deftere çözümlü olarak yapılacak.',
        teslimTarihi: new Date(bugun.getTime() + 3 * 24 * 60 * 60 * 1000),
        sinifId: sinif12A.id,
        dersId: dersFizik.id,
        ogretmenId: ogretmenFatma.id
      }
    });

    if (ogrenciMehmet && ogrenciAyse) {
      await prisma.odevTeslim.createMany({
        data: [
          {
            odevId: odev2.id,
            ogrenciId: ogrenciMehmet.id,
            tamamlandi: false
          },
          {
            odevId: odev2.id,
            ogrenciId: ogrenciAyse.id,
            tamamlandi: true,
            tamamlanmaTarihi: new Date(bugun.getTime() - 10 * 60 * 60 * 1000)
          }
        ]
      });
    }
  }
  console.log('✅ Ödev ve Ödev Teslim örnekleri oluşturuldu.');

  // 4. SINAV TAKVİMİ
  if (dersMat) {
    await prisma.sinavTakvimi.create({
      data: {
        sinavAdi: 'Matematik 1. Dönem 1. Yazılı Sınavı',
        tarih: new Date(bugun.getTime() + 8 * 24 * 60 * 60 * 1000),
        dersId: dersMat.id
      }
    });
  }
  if (dersFizik) {
    await prisma.sinavTakvimi.create({
      data: {
        sinavAdi: 'Fizik 1. Dönem 1. Yazılı Sınavı',
        tarih: new Date(bugun.getTime() + 11 * 24 * 60 * 60 * 1000),
        dersId: dersFizik.id
      }
    });
  }
  console.log('✅ Sınav Takvimi örnekleri oluşturuldu.');

  // 5. VELİ GÖRÜŞMELERİ
  if (veliHasan && ogretmenAhmet) {
    await prisma.veliGorusme.create({
      data: {
        tarih: new Date(bugun.getTime() + 2 * 24 * 60 * 60 * 1000),
        saat: '14:30',
        durum: 'BEKLIYOR',
        aciklama: 'Mehmet\'in son matematik deneme sınavı sonuçlarını değerlendirmek istiyorum.',
        veliId: veliHasan.id,
        ogretmenId: ogretmenAhmet.id
      }
    });
  }

  if (veliHasan && ogretmenFatma) {
    await prisma.veliGorusme.create({
      data: {
        tarih: new Date(bugun.getTime() + 4 * 24 * 60 * 60 * 1000),
        saat: '11:00',
        durum: 'ONAYLANDI',
        aciklama: 'Mehmet\'in genel derse katılımı ve ödev takibi üzerine rehberlik görüşmesi.',
        veliId: veliHasan.id,
        ogretmenId: ogretmenFatma.id
      }
    });
  }
  console.log('✅ Veli Görüşme örnekleri oluşturuldu.');

  console.log('\n🎉 Seed tamamlandı!');
}


main()
  .catch((e) => {
    console.error('Seed hatası:', e);
    process.exit(1);
  });
