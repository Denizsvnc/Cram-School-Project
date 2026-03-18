import './App.css'
import { Navigate, Route, Routes } from 'react-router'
import type { ReactNode } from 'react'
import AuthPages from './Pages/AuthPages'
import Panel from './Pages/Panel'
const isAuthenticated = (): boolean => {
  return Boolean(localStorage.getItem('token'));
};

function ProtectedRoute({ children }: { children: ReactNode }) {
  if (!isAuthenticated()) {
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
