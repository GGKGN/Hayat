"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { updateUserHeartbeat } from "@/actions/user-heartbeat"

export default function Heartbeat() {
    const { data: session } = useSession()

    useEffect(() => {
        if (!session) return

        // Initial call
        updateUserHeartbeat()

        // Interval call (every 2 minutes)
        const interval = setInterval(() => {
            updateUserHeartbeat()
        }, 2 * 60 * 1000)

        return () => clearInterval(interval)
    }, [session])

    return null
}
