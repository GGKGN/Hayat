"use client"

import { SessionProvider } from "next-auth/react"
import Heartbeat from "@/components/Heartbeat"

interface ProvidersProps {
    children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
    return (
        <SessionProvider>
            <Heartbeat />
            {children}
        </SessionProvider>
    )
}
