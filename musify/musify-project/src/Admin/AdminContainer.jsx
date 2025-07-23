import React from 'react'
import AdminContent from './AdminContent'
import AdminSidebar from './AdminSidebar'
// import { Outlet } from 'react-router-dom'

const AdminContainer = () => {
  return (
    <section className='w-full h-[calc(100vh-70px)] flex bg-slate-800 overflow-auto'> 
    
    <AdminSidebar/>   
    <AdminContent/>

      
    </section>
  )
}

export default AdminContainer
