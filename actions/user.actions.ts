'use server'

import { supabaseClient } from "@/types/supabase-client";

type waitlist = {
    email_address: string;
    name: string;
    phone_number: string;
    admission_number: string;
}

export async function addToWaitlist({ name, email_address, phone_number, admission_number }: waitlist) {
    try {
        const { data, error } = await supabaseClient
            .from('waitlist')
            .upsert({ name, email_address, phone_number, admission_number });
        if (error) {
            return error;
        }
        return data;
    } catch (error) {
        console.error('Error adding to waitlist:', error);
        throw error;
    }
}