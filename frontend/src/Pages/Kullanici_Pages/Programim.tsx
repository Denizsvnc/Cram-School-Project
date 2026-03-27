import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function Programim() {
  const dummyProgram = [
    { gun: 'Pazartesi', saat: '09:00 - 09:40', ders: 'Matematik', ogretmen: 'Ahmet Kaya' },
    { gun: 'Salı', saat: '10:00 - 10:40', ders: 'Fizik', ogretmen: 'Fatma Demir' },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Ders Programım
      </Typography>
      <Paper elevation={3} sx={{ mt: 3, borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Gün</strong></TableCell>
                <TableCell><strong>Saat</strong></TableCell>
                <TableCell><strong>Ders</strong></TableCell>
                <TableCell><strong>Öğretmen</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dummyProgram.map((p, index) => (
                <TableRow key={index}>
                  <TableCell>{p.gun}</TableCell>
                  <TableCell>{p.saat}</TableCell>
                  <TableCell>{p.ders}</TableCell>
                  <TableCell>{p.ogretmen}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}