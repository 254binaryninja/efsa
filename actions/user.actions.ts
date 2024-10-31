'use server'

import { supabaseClient } from "@/types/supabase-client";

// Types for the waitlist entry
interface Waitlist {
    name: string;
    email_address: string;
    phone_number: string;
    admission_number: string;
}

// Custom error types for better error handling
interface WaitlistError {
    type: 'DUPLICATE_EMAIL' | 'DUPLICATE_ADMISSION' | 'DUPLICATE_PHONE' | 'SERVER_ERROR';
    message: string;
    field?: string;
}

interface WaitlistResponse {
    data: any | null;
    error: WaitlistError | null;
}

export async function addToWaitlist({
                                        name,
                                        email_address,
                                        phone_number,
                                        admission_number,
                                    }: Waitlist): Promise<WaitlistResponse> {
    try {
        // First, check for existing entries
        const { data: existingEmail } = await supabaseClient
            .from('waitlist')
            .select('email_address')
            .eq('email_address', email_address.toLowerCase())
            .single();

        if (existingEmail) {
            return {
                data: null,
                error: {
                    type: 'DUPLICATE_EMAIL',
                    message: 'This email address is already registered',
                    field: 'email_address',
                },
            };
        }

        // Check for duplicate admission number
        const { data: existingAdmission } = await supabaseClient
            .from('waitlist')
            .select('admission_number')
            .eq('admission_number', admission_number)
            .single();

        if (existingAdmission) {
            return {
                data: null,
                error: {
                    type: 'DUPLICATE_ADMISSION',
                    message: 'This admission number is already registered',
                    field: 'admission_number',
                },
            };
        }

        // Check for duplicate phone number
        const { data: existingPhone } = await supabaseClient
            .from('waitlist')
            .select('phone_number')
            .eq('phone_number', phone_number)
            .single();

        if (existingPhone) {
            return {
                data: null,
                error: {
                    type: 'DUPLICATE_PHONE',
                    message: 'This phone number is already registered',
                    field: 'phone_number',
                },
            };
        }

        // If no duplicates found, proceed with insertion
        const { data, error } = await supabaseClient
            .from('waitlist')
            .insert([
                {
                    name,
                    email_address: email_address.toLowerCase(),
                    phone_number,
                    admission_number,
                    created_at: new Date().toISOString(),
                    status: 'pending',
                },
            ])
            .select()
            .single();

        if (error) {
            return {
                data: null,
                error: {
                    type: 'SERVER_ERROR',
                    message: 'Failed to add to waitlist',
                },
            };
        }

        return {
            data,
            error: null,
        };

    } catch (error) {
        console.error('Error adding to waitlist:', error);
        return {
            data: null,
            error: {
                type: 'SERVER_ERROR',
                message: 'An unexpected error occurred',
            },
        };
    }
}