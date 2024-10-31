'use client'

import React, { useState } from 'react'
import { useToast } from "@/hooks/use-toast"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form
} from "@/components/ui/form"
import CustomInput from './CustomInput';
import { contactFormShema } from "@/types/utils";
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {addToWaitlist} from "@/actions/user.actions";
import { ToastAction } from "@/components/ui/toast"


function Contact() {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const {toast} = useToast()

    const formSchema = contactFormShema()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            admissionNo: "",
            phoneNo: "",
            email: "",
        },
    })

    const handleSubmit = async(data: z.infer<typeof formSchema>) => {
      setIsLoading(true)
      try{
          const userData = {
              name:data.firstName + " " + data.lastName,
              email_address:data.email,
              phone_number:data.phoneNo,
              admission_number:data.admissionNo,
          }

          await addToWaitlist(userData)

          setIsLoading(false)
          toast({
              description: "Your have been added to the waitlist successfully.",
          })
      }catch (e) {
          console.log("Error adding user to waitlist", e)
          toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: "Please try again later",
              action: <ToastAction  altText="Refresh">Try again</ToastAction>,
          })
          setIsLoading(false)
      }
    }

    return (
        <section  className='flex flex-col gap-4 max-sm:gap-2 bg-gray-100 hover:z-10 rounded-lg p-5'>
          <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 max-sm:space-y-4">
                  <div className='flex flex-col gap-4 max-sm:gap-2'>
                      <div className="flex gap-4">
                          <CustomInput control={form.control} name='firstName' label="First Name"
                                       placeholder='Enter your first name'/>
                          <CustomInput control={form.control} name='lastName' label="Last Name"
                                       placeholder='Enter your last name'/>
                      </div>
                      <CustomInput control={form.control} name='email' label="Email" placeholder='Enter your email' />
                      <CustomInput control={form.control} name='phoneNo' label="Phone Number" placeholder='Enter phone number' />
                      <CustomInput control={form.control} name='admissionNo' label="ADM No" placeholder='Enter Adm No ...' />
                  </div>

                  <div className='relative flex items-center justify-center py-3'>
                    <Button type="submit" disabled={isLoading} className='form-btn'>
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" /> &nbsp;
                                Adding to waitlist...
                            </>
                        ) : "Join waitlist"}
                    </Button>
                  </div>
              </form>
          </Form>
        </section>
    );
}

export default Contact;