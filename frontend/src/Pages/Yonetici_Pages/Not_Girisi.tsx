import { Box, Typography, Paper, TextField, Button, Grid, MenuItem } from '@mui/material';
import { useState } from 'react';

export default function NotGirisi() {
  const [ders, setDers] = useState('');
  const [ogrenciId, setOgrenciId] = useState('');
  const [not, setNot] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API Call
    alert(`Not Girildi: Öğrenci ${ogrenciId}, Ders ${ders}, Not: ${not}`);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Not Girişi
      </Typography>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 600, mt: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField select label="Ders Seçin" fullWidth value={ders} onChange={(e) => setDers(e.target.value)} required>
                <MenuItem value="Matematik">Matematik</MenuItem>
                <MenuItem value="Fizik">Fizik</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField label="Öğrenci TC/No" fullWidth value={ogrenciId} onChange={(e) => setOgrenciId(e.target.value)} required />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField type="number" label="Sınav Notu" fullWidth value={not} onChange={(e) => setNot(e.target.value)} required />
            </Grid>
            <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end">
              <Button type="submit" variant="contained" color="primary" size="large">
                Kaydet
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}