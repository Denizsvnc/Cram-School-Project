import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function Program() {
  const dummyProgram = [
    { gun: 'Pazartesi', saat: '09:00 - 09:40', sinif: '12-A', ders: 'Matematik' },
    { gun: 'Salı', saat: '10:00 - 10:40', sinif: '11-B', ders: 'Matematik' },
    { gun: 'Çarşamba', saat: '11:00 - 11:40', sinif: '10-C', ders: 'Matematik' },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Öğretmen Ders Programı
      </Typography>
      <Paper elevation={3} sx={{ mt: 3, borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>Gün</strong></TableCell>
                <TableCell><strong>Saat</strong></TableCell>
                <TableCell><strong>Sınıf</strong></TableCell>
                <TableCell><strong>Ders</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dummyProgram.map((p, index) => (
                <TableRow key={index}>
                  <TableCell>{p.gun}</TableCell>
                  <TableCell>{p.saat}</TableCell>
                  <TableCell>{p.sinif}</TableCell>
                  <TableCell>{p.ders}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}