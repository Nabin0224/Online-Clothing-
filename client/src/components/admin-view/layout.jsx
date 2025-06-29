import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './sidebar'
import AdminHeader from './header'
 
import { useState } from 'react'



const AdminLayout = () => {
  const [openSidebar, setopenSidebar] = useState(false)
  return (
    <div className='flex min-h-screeen w-full'>

       <AdminSidebar open={openSidebar} setOpen={setopenSidebar} />

        <div className='flex flex-col flex-1 min-h-screen'>
           <AdminHeader open={openSidebar} setOpen={setopenSidebar} /> 

            <main className=' flex-1 bg-blue-100/40 p-4 md:p-6 h-screen'>
                <Outlet />
            </main>

        </div>

    </div>
  )
}

export default AdminLayout