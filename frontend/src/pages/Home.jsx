import React from 'react'
import Header from '../components/Header'
import WhatWeDo from '../components/WhatWeDo'
import Process from '../components/Process'
import Source from '../components/Source'
import Countries from '../components/Countries'


const Home = () => {
  return (
    <div>
        <Header />
        <div className="relative z-10 bg-white">
          <WhatWeDo />
          <Source />
          <Process />  
          <Countries />
        </div>
    </div>
  )
}

export default Home
