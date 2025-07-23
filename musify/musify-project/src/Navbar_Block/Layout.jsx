import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

const Layout = () => {
  return (
  

    <>

    <Toaster/>
    <Navbar/>
    <Outlet/>
    
    
    </>
  )
}

export default Layout
