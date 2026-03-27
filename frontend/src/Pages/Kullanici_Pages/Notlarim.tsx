import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function Notlarim() {
  const dummyNotlar = [
    { ders: 'Matematik', sinavAdi: '1. Vize', puan: 85, tarih: '10.11.2023' },
    { ders: 'Fizik', sinavAdi: '1. Vize', puan: 70, tarih: '12.11.2023' },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Sınav Notlarım
      </Typography>
      <Paper elevation={3} sx={{ mt: 3, borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Ders Adı</strong></TableCell>
                <TableCell><strong>Sınav Adı</strong></TableCell>
                <TableCell><strong>Tarih</strong></TableCell>
                <TableCell><strong>Puan</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dummyNotlar.map((n, index) => (
                <TableRow key={index}>
                  <TableCell>{n.ders}</TableCell>
                  <TableCell>{n.sinavAdi}</TableCell>
                  <TableCell>{n.tarih}</TableCell>
                  <TableCell sx={{ color: n.puan >= 50 ? 'green' : 'red', fontWeight: 'bold' }}>
                    {n.puan}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}