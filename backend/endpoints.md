# API Endpoints

Bu dosya, Postman ile test edilebilecek temel backend API endpointlerini özetler.

## Authentication

- **POST /auth/kayit**
  - Kullanıcı kaydı
  - Body: { email, password, rol, isim, soy_isim, tel_no, tc_no, dogum_tarihi, egitim_durumu, odeme_planı?, odeme_durumu?, maas? }
  - Response: { mesaj, kullanici }
    {
    "email" : "ogrenci@mail.com",
    "password" : "123",
    "rol" : "OGRENCI",
    "isim" : "öğrenci1",
    "soy_isim" : "öğrenci 1 Soyisim",
    "tel_no" : "0555555",
    "tc_no" : "111111111",
    "dogum_tarihi" : "01.01.2001",
    "egitim_durumu" : "lise",
    "odeme_planı" : "aydan aya",
    "odeme_durumu" : true,
    "maas" : "10000"
    }
- **POST /auth/giris**
  - Kullanıcı girişi
  - Body: { email, password }
  - Response: { mesaj, kullanici, role, accessToken }
  - Cookie: refreshToken (otomatik set edilir)

- **POST /auth/refresh**
  - Access token yenileme
  - Cookie: refreshToken
  - Response: { accessToken }

- **POST /auth/logout**
  - Oturumu sonlandırma
  - Cookie: refreshToken
  - Response: 204 No Content

## Kullanıcı

- **GET /kullanici/ogrenciler**
  - Tüm öğrencileri listeler
  - Header: Authorization: Bearer {accessToken}
  - Response: { message, ogrenciler, toplamOgrenci }

## Sağlık Kontrolü

- **GET /saglik**
  - Sunucu sağlık kontrolü
  - Response: { message }

---

Tüm endpointler JSON formatında yanıt verir. Yetkilendirme gerektiren endpointlerde Bearer accessToken kullanılır.

Test için örnek istekler:

- Kayıt: POST /auth/kayit
- Giriş: POST /auth/giris
- Token yenileme: POST /auth/refresh
- Çıkış: POST /auth/logout
- Öğrenci listesi: GET /kullanici/ogrenciler
- Sağlık: GET /saglik
