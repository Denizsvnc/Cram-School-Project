import { Box, Typography, Paper, Switch, FormControlLabel, Divider, Button } from '@mui/material';
import { useState } from 'react';

export default function Ayarlar() {
  const [bildirim, setBildirim] = useState(true);
  const [koyuTema, setKoyuTema] = useState(false);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Sistem Ayarları
      </Typography>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 600, mt: 3 }}>
        <Typography variant="h6" gutterBottom>Görünüm Ayarları</Typography>
        <FormControlLabel
          control={<Switch checked={koyuTema} onChange={(e) => setKoyuTema(e.target.checked)} />}
          label="Koyu Tema (Dark Mode)"
        />
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>Bildirim Ayarları</Typography>
        <FormControlLabel
          control={<Switch checked={bildirim} onChange={(e) => setBildirim(e.target.checked)} />}
          label="E-posta Bildirimleri"
        />
        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button variant="contained" color="primary">Değişiklikleri Kaydet</Button>
        </Box>
      </Paper>
    </Box>
  );
}
