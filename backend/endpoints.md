# API Endpoints

Tüm endpointler JSON döner. Giriş gerektirenlerde Bearer accessToken kullanılır.

## Auth
- **POST /auth/kayit** — Kayıt ol
- **POST /auth/giris** — Giriş yap
- **POST /auth/refresh** — Token yenile
- **POST /auth/logout** — Çıkış yap

## Kullanıcı
- **GET /kullanici/ogrenciler** — Öğrenci listesi
- **POST /kullanici/ekle** — Kullanıcı ekle
- **PUT /kullanici/ogrenci/:ogrenciNo** — Öğrenci güncelle
- **DELETE /kullanici/ogrenci/:ogrenciNo** — Öğrenci sil

## Sınıf
- **GET /sinif/liste** — Sınıf listesi
- **POST /sinif/** — Sınıf oluştur
- **DELETE /sinif/:isim** — Sınıf sil

## Ders
- **GET /ders/tum-dersler** — Tüm dersler
- **POST /ders/olustur** — Ders oluştur
- **PUT /ders/:dersId** — Ders güncelle
- **DELETE /ders/:dersId** — Ders sil

## Ders Programı
- **POST /ders-programi/olustur** — Program oluştur
- **PUT /ders-programi/:id** — Program güncelle
- **DELETE /ders-programi/:id** — Program sil

## Sınav Notu
- **POST /sinav-notu/olustur** — Not ekle
- **PUT /sinav-notu/:id** — Not güncelle
- **DELETE /sinav-notu/:id** — Not sil

## Yoklama
- **POST /yoklama/olustur** — Yoklama ekle
- **PUT /yoklama/:id** — Yoklama güncelle
- **DELETE /yoklama/:id** — Yoklama sil

## Sağlık
- **GET /saglik** — Sunucu sağlık kontrolü

---
