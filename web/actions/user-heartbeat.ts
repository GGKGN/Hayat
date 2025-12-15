"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function updateUserHeartbeat() {
    const session = await auth()
    if (!session?.user?.email) return

    try {
        await prisma.user.update({
            where: { email: session.user.email },
            data: { lastActive: new Date() }
        })
    } catch (error) {
        // Silently fail, it's just a heartbeat
        console.error("Heartbeat error:", error)
    }
}
