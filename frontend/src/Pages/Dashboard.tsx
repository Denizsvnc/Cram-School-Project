import { Box, Typography, Paper, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { kullaniciRolunuGetir } from '../services/session';

export default function Dashboard() {
  const role = kullaniciRolunuGetir();
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box p={3} sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2, background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white' }}>
            <Typography variant="h6" fontWeight="bold">Sisteme Hoşgeldiniz</Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
              Geçerli Rol: <strong>{role || 'Bilinmiyor'}</strong>
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="h6" color="textSecondary">Tarih ve Saat</Typography>
            <Typography variant="h5" color="textPrimary" fontWeight="bold" sx={{ mt: 1 }}>
              {date.toLocaleTimeString('tr-TR')}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {date.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
