'use server'

import React from 'react';
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Bottom from '@/components/Bottom'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

function Home() {
    return (
        <div className='flex flex-col'>
          <Header/>
          <Hero/>
          <Features/>
          <Bottom/>
          <Contact/>
          <Footer/>
        </div>
    );
}

export default Home;