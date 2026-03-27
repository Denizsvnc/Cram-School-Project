import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

export default function Cocuk() {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Çocuğumun Durumu
      </Typography>
      
      <Grid container spacing={3} mt={1}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Akademik Durum
              </Typography>
              <Typography variant="h3" color="primary">Başarılı</Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Son sınav notları genel ortalamanın üzerinde seyretmektedir.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Devamsızlık
              </Typography>
              <Typography variant="h3" color="error">2 Gün</Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Toplam devamsızlık hakkı: 10 gün. Mevcut durum iyi.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
