'use client'


import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import CustomInput from './CustomInput';
import { contactFormShema } from "@/types/utils";
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface contactProps {
    contactRef?: React.RefObject<HTMLElement|null>;
}

function Contact({contactRef}:contactProps) {
    return (
        <section ref={contactRef}>

        </section>
    );
}

export default Contact;