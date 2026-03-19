export const HTTP_ERRORS = {
  400: "Geçersiz istek",
  401: "Yetkisiz erişim",
  403: "Erişim yasak",
  404: "Bulunamadı",
  409: "Çakışma oluştu",
  422: "İşlenemeyen veri",
  500: "Sunucu hatası",
} as const;

export type HttpStatusCode = keyof typeof HTTP_ERRORS;