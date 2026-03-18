import {Link} from 'react-router-dom'
import {Box} from '@mui/material'
import { kullaniciRolunuGetir } from '../services/session';
import type { UserRole } from '../services/authApi';

type MenuItem = {label: string, to: string}

const menuByRole: Record<UserRole, MenuItem[]> = {
  YONETICI: [
    { label: 'Dashboard', to: '/panel' },
    { label: 'Kullanicilar', to: '/panel/kullanicilar' },
    { label: 'Ayarlar', to: '/panel/ayarlar' },
  ],
  MUDUR: [
    { label: 'Dashboard', to: '/panel' },
    { label: 'Siniflar', to: '/panel/siniflar' },
  ],
  OGRETMEN: [
    { label: 'Dashboard', to: '/panel' },
    { label: 'Programim', to: '/panel/program' },
    { label: 'Not Girisi', to: '/panel/notlar' },
  ],
  OGRENCI: [
    { label: 'Dashboard', to: '/panel' },
    { label: 'Ders Programim', to: '/panel/program' },
    { label: 'Notlarim', to: '/panel/notlarim' },
  ],
  VELI: [
    { label: 'Dashboard', to: '/panel' },
    { label: 'Cocugumun Durumu', to: '/panel/cocuk' },
  ],
  PERSONEL: [
    { label: 'Dashboard', to: '/panel' },
    { label: 'Kayit Islemleri', to: '/panel/kayit-islemleri' },
  ],
};
function Sidebar() {
    const role = kullaniciRolunuGetir();
  const menu = role ? menuByRole[role] : [];
  return (
    <>
    <Box>

        <h4>Arac Çubuğu</h4>

        {menu.map((item) => (
        <div key={item.to}>

            <Link to={item.to}>{item.label}</Link>
        </div>
        ))}
    </Box>

    
    </>
  );
}

export default Sidebar
