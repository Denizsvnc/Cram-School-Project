import { Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { SinifApi } from '../../services/sinifApi';
import type { SinifListeItem } from '../../services/types/sinif.types';

export default function Siniflar() {
  const [siniflar, setSiniflar] = useState<SinifListeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSiniflar() {
      try {
        const data = await SinifApi.getSiniflar();
        setSiniflar(data.siniflar);
      } catch (error) {
        console.error("Sınıflar yüklenemedi:", error);
      } finally {
        setLoading(false);
      }
    }
    void fetchSiniflar();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Sınıflar
      </Typography>
      
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper elevation={3} sx={{ mt: 3, borderRadius: 2 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell><strong>Sınıf Adı</strong></TableCell>
                  <TableCell><strong>Kapasite</strong></TableCell>
                  <TableCell><strong>İşlemler</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {siniflar.map((s, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{s.isim}</TableCell>
                    <TableCell>{s._count?.ogrenciler || 0} / {s.kapasite} (Kalan: {s.kapasite - (s._count?.ogrenciler || 0)})</TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" color="primary">Detay</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {siniflar.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">Sınıf bulunamadı.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}