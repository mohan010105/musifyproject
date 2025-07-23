import React from 'react'
import { Outlet } from 'react-router-dom'

const HomeContent = () => {
  return (
    <section className='w-full h-[calc(100vh-70px)] bg-gray-500 font-bold text-4xl text-white'>
      Welcome to your Profile
      <div className="pl-[25%] w-full p-6 overflow-y-auto h-screen">
      Welcome to your Profile
</div>

<Outlet/>


    </section>
  )
}
{/* </section> */}

export default HomeContent
