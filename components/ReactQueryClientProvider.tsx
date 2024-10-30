'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'


export const ReactQueryClientProvider = ({children}:{children:React.ReactNode})=>{
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions:{
                    queries:{
                        // With SSR, we usually want to set some default staleTime
                        // above 0 to avoid fetching immediately on the client
                        staleTime: 1000 * 60
                    },
                },
            })
    )
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}