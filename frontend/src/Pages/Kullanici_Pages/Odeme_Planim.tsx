import { Box, Typography, Paper, Divider, Grid, Button, CircularProgress, Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import { OdemeApi, type Odeme } from '../../services/odemeApi';
import { KullaniciService } from '../../services/kullaniciApi';
import { getCurrentUser } from '../../services/session';

export default function Odeme_Planim() {
  const [odemeler, setOdemeler] = useState<Odeme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [toplamTutar, setToplamTutar] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      const user = getCurrentUser();
      if (!user) throw new Error("Oturum bulunamadı");
      
      let userId = user.id;
      if (user.role === "VELI") {
        const veliDetay = await KullaniciService.getVeliById(user.id);
        if (veliDetay?.ogrenciler?.length > 0) {
          userId = veliDetay.ogrenciler[0].id;
        }
      }

      const data = await OdemeApi.getKullaniciOdemeler(userId);
      setOdemeler(data);

      const total = data.reduce((acc, curr) => acc + curr.miktar, 0);
      setToplamTutar(total);
    } catch (err: any) {
      setError('Ödeme planı yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOdemeYap = async (odemeId: string) => {
    try {
      setProcessingId(odemeId);
      await OdemeApi.odemeYap(odemeId);
      // alert mock payment
      alert("Ödeme işlemi başlatıldı. Yönetici onayına gönderildi.");
      await fetchData();
    } catch (err) {
      alert("Ödeme yapılamadı.");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <Box p={3}><CircularProgress /></Box>;
  if (error) return <Box p={3}><Alert severity="error">{error}</Alert></Box>;

  const odenenTutar = odemeler.filter(o => o.durum === 'ONAYLANDI' || o.durum === 'ODENDI').reduce((acc, curr) => acc + curr.miktar, 0);
  const kalanTutar = toplamTutar - odenenTutar;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Ödeme Planım
      </Typography>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 600, mt: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <Typography variant="subtitle1" color="textSecondary">Toplam Tutar:</Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="h6" align="right">{toplamTutar.toLocaleString()} TL</Typography>
          </Grid>
          
          <Grid size={{ xs: 6 }}>
            <Typography variant="subtitle1" color="textSecondary">Kalan Tutar:</Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="h6" align="right" color="error">{kalanTutar.toLocaleString()} TL</Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" gutterBottom>Taksitler</Typography>
        
        {odemeler.length === 0 ? (
          <Typography>Ödeme planı bulunamadı.</Typography>
        ) : (
          odemeler.map(odeme => (
            <Box key={odeme.id} display="flex" justifyContent="space-between" alignItems="center" mb={2} p={1} sx={{ borderBottom: '1px solid #eee' }}>
              <Box>
                <Typography>{odeme.aciklama || 'Taksit'}</Typography>
                <Typography variant="caption" color="textSecondary">
                  Tarih: {new Date(odeme.tarih).toLocaleDateString()}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                {odeme.durum === 'BEKLIYOR' ? (
                   <Typography color="orange" fontWeight="bold">Onay Bekleniyor ({odeme.miktar} TL)</Typography>
                ) : odeme.durum === 'ONAYLANDI' || odeme.durum === 'ODENDI' ? (
                   <Typography color="green" fontWeight="bold">Ödendi ({odeme.miktar} TL)</Typography>
                ) : (
                   <>
                    <Typography color="error">Bekliyor ({odeme.miktar} TL)</Typography>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="small" 
                      onClick={() => handleOdemeYap(odeme.id)}
                      disabled={processingId === odeme.id}
                    >
                      {processingId === odeme.id ? <CircularProgress size={20} /> : 'Öde'}
                    </Button>
                   </>
                )}
              </Box>
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
}