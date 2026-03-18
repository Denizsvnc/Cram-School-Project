import { Outlet } from 'react-router'
import Sidebar from '../Components/Sidebar'

function Panel() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  )
}

export default Panel
