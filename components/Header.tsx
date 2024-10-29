'use client'

import React,{useEffect,useState} from 'react';
import {cn} from '@/lib/utils'
import {Button} from "@/components/ui/button";

function Header() {
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

       return (
        <nav className={cn("flex-between px-6 py-4 lg:px-10",{
            "glassmorphism mx-7 z-50 rounded-md sticky top-5":isScrolled,
            "bg-transparent z-10 left-0 top-0 right-0":!isScrolled
        })}>
          <div className='p-5 m-3'>
            <h1 className='text-4xl max-sm:text-2xl font-bold text-color '>Economics Frontiers Students Association</h1>
          </div>

            <Button className='p-4'>
                Join Waitlist
            </Button>
        </nav>
    );
}

export default Header;