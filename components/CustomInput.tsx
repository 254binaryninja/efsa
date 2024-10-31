import React from 'react';
import {
    FormControl,
    FormField,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { contactFormShema } from "@/types/utils";
import { Control, FieldPath } from "react-hook-form"
import { z } from "zod"

const formSchema = contactFormShema()

interface CustomInput {
    control : Control<z.infer<typeof formSchema>>,
    name : FieldPath<z.infer<typeof formSchema>>,
    label: string,
    placeholder : string,
    className?:string,
}


function CustomInput({control, name, label, placeholder,className} : CustomInput) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <div className='form-item'>
                    <FormLabel className='form-label'>
                        {label}
                    </FormLabel>
                    <div className='flex w-full flex-col'>
                        <FormControl>
                            <Input
                                placeholder={placeholder}
                                className={className}
                                {...field}
                            />
                        </FormControl>
                        <FormMessage
                            className='form-message mt-2'
                        />
                    </div>
                </div>
            )}
        />
    );
}

export default CustomInput;