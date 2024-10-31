'use client'

import React,{useState} from 'react';
import Image from 'next/image'
import {useGSAP} from "@gsap/react"
import gsap from 'gsap'
import {Button} from '@/components/ui/button'
import ChatBot from "@/components/chatbot/chatBot";

function Hero() {
    useGSAP(()=>{
        gsap.fromTo("#text",{
            opacity:0,
            y:20,
        },{
            opacity:1,
            y:0,
            delay:1,
            stagger:0.5,
        })
    },[])

    const[isOpen,setOpen] = useState<boolean>(false)

    return (
        <section className='flex flex-col  gap-2'>
            <div className='p-20 max-sm:p-7'>
                <p id="text"  className='relative flex items-center justify-center font-extrabold text-4xl max-sm:text-2xl my-3 text-black px-5 '>Spearheading</p>
                <p id="text"  className='relative flex items-center justify-center font-extrabold text-4xl max-sm:text-2xl my-3 text-black px-5 '>holistic
                    transformation</p>
                <p id="text"  className='relative flex items-center justify-center font-medium text-xl text-black px-5 '>Our mission is to
                    empower members with skills, knowledge, and networks essential for success in economics, fostering holistic
                </p>
                <p id="text"  className='relative flex items-center justify-center font-medium text-xl text-black px-5 '>development and preparing them for the global job market.</p>
                <div id="text"
                    className="relative flex items-center justify-center mt-5 w-full h-[400px] ">
                    <Image
                        src="/img/img_1.jpg"
                        alt="Centered Image with Blur"
                        objectFit="cover"
                        layout='fill'
                        className="rounded-lg shadow-lg"
                    />
                    {/* Blur effect */}
                    <div
                        className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-white/70 via-white/60 to-transparent"/>
                </div>
                <div id="text" className='relative flex items-center justify-center py-3 flex-row gap-1'>
                  <Button className='p-5' onClick={()=>setOpen(true)}>
                      Chat with Cjay
                  </Button>
                    <p className="text-gray-400 px-1 font-semibold text-xl hover:cursor-wait">Coming soon...</p>
                </div>
                <ChatBot isOpen={isOpen}
                            onClose={()=>setOpen(false)}/>
            </div>
        </section>
    );
}

export default Hero;