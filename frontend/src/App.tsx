import './App.css'
import { Navigate, Route, Routes } from 'react-router'
import { useEffect, useState, type ReactNode } from 'react'
import { kullaniciRolunuGetir, tokenGetir } from './services/session';
import type { UserRole } from './services/authApi';
import { accessTokenYenile } from './services/authApi';

// Yönetici, Müdür, Öğretmen, Öğrenci, Veli, Personel page importları
import AuthPages from './Pages/AuthPages'
import Panel from './Pages/Panel'
import Dashboard from './Pages/Dashboard'
import Kullanicilar from './Pages/Yonetici_Pages/Kullanicilar';
import Ayarlar from './Pages/Yonetici_Pages/Ayarlar';
import Siniflar from './Pages/Yonetici_Pages/Siniflar';
import Program from './Pages/Yonetici_Pages/Program';
import NotGirisi from './Pages/Yonetici_Pages/Not_Girisi';
import Kayit from './Pages/Yonetici_Pages/Kayit';
import Odemeler from './Pages/Yonetici_Pages/Odemeler';

// Öğrenci, Veli page importları
import Programim from './Pages/Kullanici_Pages/Programim';
import Notlarim from './Pages/Kullanici_Pages/Notlarim';
import Cocuk from './Pages/Kullanici_Pages/Cocugumun_Durumu';
import Odeme_Planim from './Pages/Kullanici_Pages/Odeme_Planim';
const isAuthenticated = (): boolean => {
  const token = tokenGetir();
  return Boolean(token);
};

function ProtectedRoute({ children, allowedRoles }: { children: ReactNode, allowedRoles?: UserRole[] }) {
  if (!isAuthenticated()) {
    return <Navigate to='/giris' replace />;
  }

  const userRole = kullaniciRolunuGetir();

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to='/giris' replace />;
  }

  return children;
}

function App() {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = tokenGetir();
      if (!token) {
        try {
          await accessTokenYenile();
        } catch {
          // Cookie yoksa veya geçersizse giriş ekranına düşmesi beklenen davranış
        }
      }

      setAuthReady(true);
    };

    void bootstrapAuth();
  }, []);

  if (!authReady) {
    return null;
  }


  return (
    <>
      <Routes>
        <Route path='/giris' element={<AuthPages />} />
        <Route path='/auth' element={<Navigate to='/giris' replace />} />

        <Route
          path='/panel'
          element={
            <ProtectedRoute>
              <Panel />
            </ProtectedRoute>
          }
        >
          {/* panele route'unda otomatik olarak dashboard'a yönlendirme yap */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Kullanıcı rolüne göre izinli route tanımları ---- Yönetim kadrosu routelari 
          yönetici, müdür, öüretmen, personel*/}
          {/* <Route path="ogrenciler" element={<ProtectedRoute allowedRoles={['YONETICI', 'OGRETMEN']}><Ogrenciler /></ProtectedRoute>} /> */}
          <Route path="kullanicilar" element={<ProtectedRoute allowedRoles={['YONETICI']}><Kullanicilar /></ProtectedRoute>} />
          <Route path="ayarlar" element={<ProtectedRoute allowedRoles={["YONETICI"]}> <Ayarlar />  </ProtectedRoute>} />
          <Route path="siniflar" element={<ProtectedRoute allowedRoles={["YONETICI", "OGRETMEN", "MUDUR"]}> <Siniflar />  </ProtectedRoute>} />
          <Route path="program" element={<ProtectedRoute allowedRoles={["YONETICI", "OGRETMEN"]}> <Program />  </ProtectedRoute>} />
          <Route path="notlar" element={<ProtectedRoute allowedRoles={["YONETICI", "OGRETMEN", "MUDUR"]}> <NotGirisi />  </ProtectedRoute>} />
          <Route path="kayit-islemleri" element={<ProtectedRoute allowedRoles={["YONETICI", "PERSONEL", "MUDUR"]}> <Kayit />  </ProtectedRoute>} />
          <Route path="odemeler" element={<ProtectedRoute allowedRoles={["YONETICI", "MUDUR"]}> <Odemeler />  </ProtectedRoute>} />

          

             {/* Kullanıcı rolüne göre izinli route tanımları ----  Kullanıcı routeları
             öğrenci, veli*/}
          <Route path="programim" element={<ProtectedRoute allowedRoles={["OGRENCI"]}> <Programim />  </ProtectedRoute>} />
          <Route path="notlarim" element={<ProtectedRoute allowedRoles={["OGRENCI"]}> <Notlarim />  </ProtectedRoute>} />
          <Route path="cocuk" element={<ProtectedRoute allowedRoles={["VELI"]}> <Cocuk />  </ProtectedRoute>} />
          <Route path="plan" element={<ProtectedRoute allowedRoles={["VELI", "OGRENCI"]}> <Odeme_Planim />  </ProtectedRoute>} />

        </Route>

        <Route
          path='*'
          element={<Navigate to={isAuthenticated() ? '/panel' : '/giris'} replace />}
        />
      </Routes>
    </>
  )
}

export default App
