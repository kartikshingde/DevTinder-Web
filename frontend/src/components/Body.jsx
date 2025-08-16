import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router'
import Footer from './Footer'

const Body = () => {
  return (
    <div>
        <Navbar />
        <Outlet />
        <Footer />



        {/* outlet => to render the children routes of parent  */}
    </div>
  )
}

export default Body