'use client'

import React,{useEffect,useState} from 'react';
import {cn} from '@/lib/utils'
import {Button} from "@/components/ui/button";
import Image from 'next/image'

interface ContactProps {
    contactRef: React.RefObject<HTMLElement|null>;
}

function Header({contactRef}:ContactProps) {
    const [isScrolled,setIsScrolled] = useState<boolean>(false)

    useEffect(()=>{
        const handleScroll = () => {
            if(window.scrollY > 0){
                setIsScrolled(true)
            }else{
                setIsScrolled(false)
            }
        }
        window.addEventListener("scroll",handleScroll)
        return ()=>window.removeEventListener("scroll",handleScroll)
    },[])

    const handleButtonClick = () => {
        if(contactRef.current) {
            contactRef.current.scrollIntoView({behavior:"smooth"})
        }
    }

       return (
        <nav className={cn("flex-between py-2 lg:px-10 max-sm:px-0",{
            "glassmorphism mx-7 max-sm:mx-1  px-0  z-50 rounded-md sticky top-5":isScrolled,
            "bg-transparent z-10 left-0 top-0 right-0":!isScrolled
        })}>
          <div className='flex flex-row gap-2 p-5 max-sm:p-0 max-sm:m-0  m-3'>
              <Image src='/img/logo.png' alt='Efsa-KU logo' width={170} height={170}/>
            <h1 className='text-4xl max-sm:text-2xl py-10 font-extrabold text-color '>Economics Frontiers Students Association</h1>
          </div>

            <Button className='p-4' onClick={()=>handleButtonClick()}>
                Join Waitlist
            </Button>
        </nav>
    );
}

export default Header;