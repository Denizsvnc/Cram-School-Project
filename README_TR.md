Projenin il kurulumu;

Bilgisayarınızda şunlar kurulu olmalı;

- NodeJS
- PostgreSQL


1 - İlk önce cihazınızda bir database oluşturun isim : örn: dershane
2 - Daha sonra backend klasörü içerisinde .env dosyasını oluşturun ve .env.example dosyası içeriğine bakarak gerekli alanları doldurun
3 - Daha sonra backend klasörü içerisinde npm i  komutunu çalışştırın bu projenin gerekli bağımlılık paketlerini kurar
4 - Terminalde sırasıyla ; 
    npx prisma migrate --dev migrate init 
    npx prisma generate
    npx prisma db push
Daha sonra göz ile kontrol etmek için backend klasörü içerisinde terminale npx prisma studio komutunu çalıştırın


Backend'i ayağa kaldırmak için backend klasörü içerisinde terminalde npm run dev komutunu çalıştırın.
API Endpointlerini app.ts içersindeki routerlardan inceleyebilirsiniz