import {Link} from 'react-router-dom'
import {Box, Button} from '@mui/material'
import { kullaniciRolunuGetir } from '../services/session';
import { cikisYap, type UserRole } from '../services/authApi';
import "./sidebar.css"

type MenuItem = {label: string, to: string}

const menuByRole: Record<UserRole, MenuItem[]> = {
  YONETICI: [
    { label: 'Dashboard', to: '/panel' },
    { label: 'Kullanicilar', to: '/panel/kullanicilar' },
    { label: 'Ayarlar', to: '/panel/ayarlar' },
    { label: 'Siniflar', to: '/panel/siniflar' },
    { label: 'Kayit Islemleri', to: '/panel/kayit-islemleri' },


  ],
  MUDUR: [
    { label: 'Dashboard', to: '/panel' },
    { label: 'Siniflar', to: '/panel/siniflar' },
    { label: 'Kayit Islemleri', to: '/panel/kayit-islemleri' },

  ],
  OGRETMEN: [
    { label: 'Dashboard', to: '/panel' },
    { label: 'Programim', to: '/panel/program' },
    { label: 'Not Girisi', to: '/panel/notlar' },
    { label: 'Siniflar', to: '/panel/siniflar' },


  ],
  OGRENCI: [
    { label: 'Dashboard', to: '/panel' },
    { label: 'Ders Programim', to: '/panel/programim' },
    { label: 'Notlarim', to: '/panel/notlarim' },
    { label: 'Ödeme Planım', to: '/panel/plan' },

  ],
  VELI: [
    { label: 'Dashboard', to: '/panel' },
    { label: 'Cocugumun Durumu', to: '/panel/cocuk' },
    { label: 'Ödeme Planım', to: '/panel/plan' },
    
  ],
  PERSONEL: [
    { label: 'Dashboard', to: '/panel' },
    { label: 'Kayit Islemleri', to: '/panel/kayit-islemleri' },
  ],
};
function Sidebar() {
    const role = kullaniciRolunuGetir();
   
    const handleCikis = async () => {
      try {
        await cikisYap();
      }catch (error) {
        console.error('Çıkış yaparken hata oluştu:', error);
      } finally {
        window.location.href = '/giris';
      }
    }
    
  const menu = role ? menuByRole[role] : [];
  return (
    <Box className="sidebar-container">
      <div className="sidebar-logo">
        <span className="logo-title">Araç Çubuğu</span>
      </div>
      <div className="sidebar-menu">
        {menu.map((item) => (
          <div className="link-container" key={item.to}>
            <Link className="sidebar-item" to={item.to}>
              <span className="sidebar-icon">•</span>
              {item.label}
            </Link>
          </div>
        ))}
      </div>
      <Button className="sidebar-logout" onClick={handleCikis} variant="contained" color="error">
        Çıkış Yap
      </Button>
    </Box>
  );

}

export default Sidebar
