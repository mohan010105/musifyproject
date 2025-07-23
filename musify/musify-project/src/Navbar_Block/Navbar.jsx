import React from 'react'
import Logo from './Logo'
import Menu from './Menu'

const Navbar = () => {
  return (
<nav className='bg-stone-950 flex h-[70px] text-white items-center justify-between px-20'>

    <Logo/>
    <Menu/>
</nav>
  )
}

export default Navbar
