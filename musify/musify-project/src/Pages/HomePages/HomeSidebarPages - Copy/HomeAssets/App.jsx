import React from 'react'
import Navbar from './Navbar_Block/Navbar'
import { RouterProvider } from 'react-router-dom'
import { MyMap } from './Routes/Map'
import AuthContex from './Contex/AuthContex'


const App = () => {
  return (
    <div>
      <AuthContex>
      <RouterProvider router={MyMap}/>
      </AuthContex>
    </div>
  
  )
}

export default App
