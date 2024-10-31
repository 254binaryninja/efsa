'use client'

import React,{useRef} from 'react';
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Bottom from '@/components/Bottom'
import Footer from '@/components/Footer'

function Home() {

    const contactRef = useRef<HTMLElement>(null)

    return (
        <div className='flex flex-col'>
          <Header
           contactRef={contactRef}
          />
          <Hero/>
          <Features/>
          <Bottom
              contactRef={contactRef}
          />
          <Footer/>
        </div>
    );
}

export default Home;