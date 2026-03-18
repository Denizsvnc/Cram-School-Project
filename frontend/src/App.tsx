import './App.css'
import { Navigate, Route, Routes } from 'react-router'
import type { ReactNode } from 'react'
import { kullaniciRolunuGetir, tokenGetir } from './services/session';

import type { UserRole } from './services/authApi';
import AuthPages from './Pages/AuthPages'
import Panel from './Pages/Panel'
const isAuthenticated = (): boolean => {
  const token = tokenGetir();
  return Boolean(token) && token !== 'null' && token !== 'undefined';
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
        />

        <Route
          path='*'
          element={<Navigate to={isAuthenticated() ? '/panel' : '/giris'} replace />}
        />

      </Routes>
    </>
  )
}

export default App
