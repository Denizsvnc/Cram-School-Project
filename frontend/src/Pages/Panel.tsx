import { Outlet } from 'react-router'
import Sidebar from '../Components/Sidebar'
import Appbar from '../Components/Appbar'
function Panel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Appbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '20px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Panel
