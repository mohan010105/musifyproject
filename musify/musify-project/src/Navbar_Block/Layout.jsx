import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import FooterPlayer from '../components/FooterPlayer'

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster/>
      <Navbar/>
      <main className="flex-1 pb-20">
        <Outlet/>
      </main>
      <FooterPlayer/>
    </div>
  )
}

export default Layout
