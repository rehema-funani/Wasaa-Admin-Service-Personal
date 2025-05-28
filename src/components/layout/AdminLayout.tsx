import { Outlet } from 'react-router-dom'
import SlimSidebar from './LeftMenu'
import TopNavigation from './TopNavigation'

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <SlimSidebar />

      <div className="flex-1 flex flex-col">
        <TopNavigation />
        <main className="w-full mt-[70px] overflow-x-hidden overflow-y-auto bg-gray-50 p-12">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout