import {z} from 'zod'

// Create schema for waitlist form
export const contactFormShema = () => z.object({
    firstName:z.string().min(3),
    lastName:z.string().min(3),
    admissionNo:z.string().min(8),
    phoneNo:z.string().min(10),
    email:z.string().email(),
})