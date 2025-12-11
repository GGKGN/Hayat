"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { writeFile } from "fs/promises"
import { join } from "path"

export async function uploadProfileImage(userId: string, formData: FormData) {
    const file = formData.get("file") as File

    if (!file) {
        return { error: "No file uploaded" }
    }

    // Server-side size validation (Backup)
    if (file.size > 5 * 1024 * 1024) {
        return { error: "File too large (Max 5MB)" }
    }

    try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = file.name.split('.').pop()
        const filename = `profile-${userId}-${uniqueSuffix}.${ext}`

        // Save to public/uploads
        const uploadDir = join(process.cwd(), 'public', 'uploads')

        try {
            await require("fs/promises").mkdir(uploadDir, { recursive: true })
        } catch (error) {
            // Ignore error if folder exists
        }

        const path = join(uploadDir, filename)
        await writeFile(path, buffer)

        // Public URL
        const imageUrl = `/uploads/${filename}`

        // Update User
        await prisma.user.update({
            where: { id: userId },
            data: { image: imageUrl }
        })

        revalidatePath("/profile")
        return { success: true, imageUrl }

    } catch (e) {
        console.error("Upload error:", e)
        return { error: "Failed to upload image" }
    }
}

export async function uploadEventImage(formData: FormData) {
    const file = formData.get("file") as File

    if (!file) {
        return { error: "No file uploaded" }
    }

    try {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = file.name.split('.').pop()
        // Ensure only valid extensions if needed, but for now allow generic images
        const filename = `event-${uniqueSuffix}.${ext}`

        // Save to public/uploads/events
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'events')

        try {
            await require("fs/promises").mkdir(uploadDir, { recursive: true })
        } catch (error) {
            // Ignore error if folder exists
        }

        const path = join(uploadDir, filename)
        await writeFile(path, buffer)

        // Public URL
        const imageUrl = `/uploads/events/${filename}`

        return { success: true, imageUrl }

    } catch (e) {
        console.error("Upload error:", e)
        return { error: "Failed to upload image" }
    }
}
