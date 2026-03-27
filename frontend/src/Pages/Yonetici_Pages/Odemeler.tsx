import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import { OdemeApi, type Odeme } from '../../services/odemeApi';

export default function Odemeler() {
  const [odemeler, setOdemeler] = useState<Odeme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOdemeler = async () => {
    try {
      setLoading(true);
      const data = await OdemeApi.getBekleyenOdemeler();
      setOdemeler(data);
    } catch (err: any) {
      setError('Ödemeler yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOdemeler();
  }, []);

  const handleOnayla = async (id: string) => {
    try {
      await OdemeApi.odemeOnayla(id);
      fetchOdemeler(); // Refresh the list
    } catch (err: any) {
      setError('Ödeme onaylanırken hata oluştu.');
    }
  };

  if (loading) return <Typography p={3}>Yükleniyor...</Typography>;

  const bekleyenOdemeler = odemeler.filter(o => o.durum === 'BEKLIYOR');
  const dgerOdemeler = odemeler.filter(o => o.durum !== 'BEKLIYOR');

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Ödemeler Yönetimi
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Typography variant="h6" mt={3} mb={2}>Onay Bekleyen Ödemeler</Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Kullanıcı</strong></TableCell>
              <TableCell><strong>Açıklama</strong></TableCell>
              <TableCell><strong>Miktar (TL)</strong></TableCell>
              <TableCell><strong>Durum</strong></TableCell>
              <TableCell align="center"><strong>Aksiyon</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bekleyenOdemeler.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Bekleyen ödeme yok.</TableCell>
              </TableRow>
            ) : (
              bekleyenOdemeler.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.kullanici?.isim} {row.kullanici?.soy_isim}</TableCell>
                  <TableCell>{row.aciklama}</TableCell>
                  <TableCell>{row.miktar}</TableCell>
                  <TableCell sx={{ color: 'orange', fontWeight: 'bold' }}>{row.durum}</TableCell>
                  <TableCell align="center">
                    <Button variant="contained" color="success" onClick={() => handleOnayla(row.id)}>
                      Onayla
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" mt={5} mb={2}>Geçmiş Ödemeler</Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Kullanıcı</strong></TableCell>
              <TableCell><strong>Açıklama</strong></TableCell>
              <TableCell><strong>Miktar (TL)</strong></TableCell>
              <TableCell><strong>Onay Tarihi</strong></TableCell>
              <TableCell><strong>Durum</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dgerOdemeler.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Kayıtlı ödeme yok.</TableCell>
              </TableRow>
            ) : (
              dgerOdemeler.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.kullanici?.isim} {row.kullanici?.soy_isim}</TableCell>
                  <TableCell>{row.aciklama}</TableCell>
                  <TableCell>{row.miktar}</TableCell>
                  <TableCell>{row.sonOdemeTarihi ? new Date(row.sonOdemeTarihi).toLocaleDateString() : '-'}</TableCell>
                  <TableCell sx={{ color: row.durum === 'ONAYLANDI' ? 'green' : 'textSecondary', fontWeight: 'bold' }}>{row.durum}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
