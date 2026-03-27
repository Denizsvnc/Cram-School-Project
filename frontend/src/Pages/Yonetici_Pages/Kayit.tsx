import { Box, Typography, Paper, TextField, Button, Grid, MenuItem, Alert } from '@mui/material';
import { useState } from 'react';
import { KullaniciService } from '../../services/kullaniciApi';

export default function Kayit() {
  const [formData, setFormData] = useState({
    isim: '',
    soy_isim: '',
    tc_no: '',
    mail: '',
    tel_no: '',
    rol: 'OGRENCI',
    sifre: '', 
    dogum_tarihi: '',
    egitim_durumu: '',
    odeme_plani: 'Aylık',
    maas: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Hata varsa ilgili alanın hatasını temizle
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    let tempErrors: Record<string, string> = {};
    if (!formData.isim) tempErrors.isim = 'İsim gerekli';
    if (!formData.soy_isim) tempErrors.soy_isim = 'Soy isim gerekli';
    
    // TC No Validation: Exactly 11 digits, strictly numbers
    if (!/^\d{11}$/.test(formData.tc_no)) {
      tempErrors.tc_no = 'TC Kimlik No 11 haneli sadece rakamlardan oluşmalıdır';
    }

    // Email Validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.mail)) {
      tempErrors.mail = 'Geçerli bir email adresi giriniz';
    }

    // Phone Validation: Basic digits check, normally 10 or 11
    if (!/^\d{10,11}$/.test(formData.tel_no.replace(/\s+/g, ''))) {
      tempErrors.tel_no = 'Geçerli bir telefon numarası giriniz (Örn: 05xxxxxxxxx)';
    }

    // Password validation
    if (!formData.sifre || formData.sifre.length < 6) {
      tempErrors.sifre = 'Şifre en az 6 karakter olmalıdır';
    }

    // Date of Birth validation
    if (!formData.dogum_tarihi) {
      tempErrors.dogum_tarihi = 'Doğum tarihi gereklidir';
    }

    // Education Status validation
    if (!formData.egitim_durumu) {
      tempErrors.egitim_durumu = 'Eğitim durumu gereklidir';
    }

    // Conditional role validation
    const maasZorunluRoller = ['OGRETMEN', 'MUDUR', 'PERSONEL'];
    if (formData.rol === 'OGRENCI' && !formData.odeme_plani) {
      tempErrors.odeme_plani = 'Öğrenci için ödeme planı seçilmelidir';
    }
    if (maasZorunluRoller.includes(formData.rol) && !formData.maas) {
      tempErrors.maas = 'Personel için maaş girilmelidir';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleKayıt = async () => {
    setSuccess(false);
    if (!validate()) return;
    
    try {
      // Axios may throw an error with response.data.message
      const payload: any = {
         isim: formData.isim,
         soy_isim: formData.soy_isim,
         tc_no: formData.tc_no,
         tel_no: formData.tel_no,
         mail: formData.mail,
         rol: formData.rol,
         password: formData.sifre,
         egitim_durumu: formData.egitim_durumu,
         dogum_tarihi: new Date(formData.dogum_tarihi).toISOString()
      };

      if (formData.rol === 'OGRENCI') {
        payload.odeme_plani = formData.odeme_plani;
        payload.odeme_durumu = false;
      } else if (maasZorunluRoller.includes(formData.rol)) {
        payload.maas = formData.maas;
        payload.maas_odendi_mi = false;
      }

      await KullaniciService.kullaniciOlustur(payload);
      setSuccess(true);
      setFormData({...formData, isim: '', soy_isim: '', tc_no: '', mail: '', tel_no: '', sifre: '', dogum_tarihi: '', egitim_durumu: '', maas: ''});
    } catch (error: any) {
      const serverMessage = error.response?.data?.message || 'Geçersiz bilgiler veya kayıtlı TC/Email.';
      alert(`Kayıt işlemi başarısız: ${serverMessage}`);
    }
  };

  const maasZorunluRoller = ['OGRETMEN', 'MUDUR', 'PERSONEL'];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Yeni Kayıt İşlemi
      </Typography>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 800, mt: 3 }}>
        {success && <Alert severity="success" sx={{ mb: 3 }}>Kullanıcı başarıyla kaydedildi!</Alert>}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField 
              label="İsim" 
              fullWidth 
              value={formData.isim}
              onChange={(e) => handleChange('isim', e.target.value)}
              error={!!errors.isim}
              helperText={errors.isim || ' '}
              required 
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField 
              label="Soy İsim" 
              fullWidth 
              value={formData.soy_isim}
              onChange={(e) => handleChange('soy_isim', e.target.value)}
              error={!!errors.soy_isim}
              helperText={errors.soy_isim || ' '}
              required 
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField 
              label="TC Kimlik No" 
              fullWidth 
              inputProps={{ maxLength: 11 }}
              value={formData.tc_no}
              onChange={(e) => handleChange('tc_no', e.target.value)}
              error={!!errors.tc_no}
              helperText={errors.tc_no || ' '}
              required 
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField 
              label="Email" 
              type="email" 
              fullWidth 
              value={formData.mail}
              onChange={(e) => handleChange('mail', e.target.value)}
              error={!!errors.mail}
              helperText={errors.mail || ' '}
              required 
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField 
              label="Telefon Numarası" 
              fullWidth 
              inputProps={{ maxLength: 11 }}
              value={formData.tel_no}
              onChange={(e) => handleChange('tel_no', e.target.value)}
              error={!!errors.tel_no}
              helperText={errors.tel_no || ' '}
              required 
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField 
              select 
              label="Kayıt Tipi (Rol)" 
              fullWidth 
              value={formData.rol} 
              onChange={(e) => handleChange('rol', e.target.value)}
            >
              <MenuItem value="OGRENCI">Öğrenci</MenuItem>
              <MenuItem value="OGRETMEN">Öğretmen</MenuItem>
              <MenuItem value="VELI">Veli</MenuItem>
              <MenuItem value="PERSONEL">Personel</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField 
              label="Şifre" 
              type="password" 
              fullWidth 
              value={formData.sifre}
              onChange={(e) => handleChange('sifre', e.target.value)}
              error={!!errors.sifre}
              helperText={errors.sifre || ' '}
              required 
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField 
              label="Doğum Tarihi" 
              type="date" 
              fullWidth 
              value={formData.dogum_tarihi}
              onChange={(e) => handleChange('dogum_tarihi', e.target.value)}
              InputLabelProps={{ shrink: true }}
              error={!!errors.dogum_tarihi}
              helperText={errors.dogum_tarihi || ' '}
              required 
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField 
              select 
              label="Eğitim Durumu" 
              fullWidth 
              value={formData.egitim_durumu}
              onChange={(e) => handleChange('egitim_durumu', e.target.value)}
              error={!!errors.egitim_durumu}
              helperText={errors.egitim_durumu || ' '}
              required
            >
              <MenuItem value="İlkokul">İlkokul</MenuItem>
              <MenuItem value="Ortaokul">Ortaokul</MenuItem>
              <MenuItem value="Lise">Lise</MenuItem>
              <MenuItem value="Üniversite">Üniversite</MenuItem>
              <MenuItem value="Mezun">Mezun</MenuItem>
            </TextField>
          </Grid>
          
          {/* Conditional Fields Based on Role */}
          {formData.rol === 'OGRENCI' && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                select 
                label="Ödeme Planı" 
                fullWidth 
                value={formData.odeme_plani}
                onChange={(e) => handleChange('odeme_plani', e.target.value)}
                error={!!errors.odeme_plani}
                helperText={errors.odeme_plani || ' '}
                required
              >
                <MenuItem value="Aylık">Aylık</MenuItem>
                <MenuItem value="Peşin">Peşin</MenuItem>
                <MenuItem value="Yıllık">Yıllık</MenuItem>
              </TextField>
            </Grid>
          )}

          {maasZorunluRoller.includes(formData.rol) && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                label="Maaş (TL)" 
                type="number"
                fullWidth 
                value={formData.maas}
                onChange={(e) => handleChange('maas', e.target.value)}
                error={!!errors.maas}
                helperText={errors.maas || ' '}
                required
              />
            </Grid>
          )}

          <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" size="large" onClick={handleKayıt}>
              Kullanıcıyı Kaydet
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}