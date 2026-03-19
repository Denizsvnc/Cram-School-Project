import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { kullaniciRolunuGetir } from '../services/session';
import { cikisYap } from '../services/authApi';


export default function Appbar() {
  const role = kullaniciRolunuGetir();
  const [userName, setUserName] = React.useState('');

  React.useEffect(() => {
    // Kullanıcı adını session veya API'den çekebilirsiniz
    // Örnek: localStorage veya session'dan
    const name = localStorage.getItem('userName') || '';
    setUserName(name);
  }, []);

  const handleLogout = async () => {
    await cikisYap();
    window.location.href = '/giris';
  };

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(90deg, #1f3ff5 60%, #3f51b5 100%)', boxShadow: '0 2px 8px rgba(31,63,245,0.08)' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: '56px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ background: '#fff', color: '#1f3ff5', fontWeight: 'bold', fontSize: 22, width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(31,63,245,0.12)', mr: 2 }}>
            SH
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
            StudyHub
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AccountCircle sx={{ color: '#fff', fontSize: 28 }} />
          <Typography variant="body1" sx={{ color: '#fff', fontWeight: 500 }}>
            {userName || 'Kullanıcı'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#e0e0e0', fontWeight: 400, ml: 1 }}>
            {role}
          </Typography>
          <Button variant="contained" color="error" sx={{ ml: 2, borderRadius: 2, fontWeight: 600 }} onClick={handleLogout}>
            Çıkış Yap
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
