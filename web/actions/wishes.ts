"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getWishes() {
    const wishes = await prisma.wish.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    image: true,
                },
            },
            volunteer: {
                select: {
                    name: true,
                    image: true,
                }
            }
        },
        orderBy: {
            createdAt: "desc",
        },
    })

    const statusOrder = {
        PENDING: 0,
        IN_PROCESS: 1,
        COMPLETED: 2
    }

    return wishes.sort((a, b) => {
        const orderA = statusOrder[a.status] ?? 99;
        const orderB = statusOrder[b.status] ?? 99;
        return orderA - orderB;
    })
}

import { auth } from "@/lib/auth"

export async function createWish(formData: FormData) {
    const session = await auth()
    if (!session || session.user.role === "USER") {
        return { error: "Unauthorized" }
    }

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const url = formData.get("url") as string
    const childName = formData.get("childName") as string
    const childAge = parseInt(formData.get("childAge") as string) || null
    const estimatedDateStr = formData.get("estimatedDate") as string
    const volunteerId = formData.get("volunteerId") as string
    const imageUrl = formData.get("imageUrl") as string // Assuming client handles upload and sends URL, OR we handle file here. 
    // Ideally we handle file upload similarly to 'uploadEventImage'. 
    // But for now let's assume the client might send a URL or we need to implement upload.
    // The design shows drag & drop image upload.
    // Let's assume we use a separate action for upload or handle it if it's a file.
    // If it's a file, we need `uploadImage` logic. 
    // I'll assume 'imageUrl' is passed for now to keep it simple or if we use the existing upload logic, 
    // but the `uploadEventImage` was specific to events? 
    // Let's check `actions/upload.ts` next.
    // For now, I'll extract imageUrl.

    let estimatedDate = null
    if (estimatedDateStr) {
        estimatedDate = new Date(estimatedDateStr)
    }

    await prisma.wish.create({
        data: {
            title,
            description,
            url,
            userId: session.user.id,
            status: "PENDING",
            childName,
            childAge,
            estimatedDate,
            volunteerId: volunteerId === "NO_VOLUNTEER" ? null : volunteerId,
            imageUrl
        },
    })
    revalidatePath("/")
    revalidatePath("/profile")
    return { success: true }
}

export async function updateWishStatus(id: string, status: "PENDING" | "IN_PROCESS" | "COMPLETED") {
    await prisma.wish.update({
        where: { id },
        data: { status },
    })
    revalidatePath("/")
    revalidatePath("/admin")
    revalidatePath("/admin")
}

export async function updateWishDetails(id: string, data: any) {
    await prisma.wish.update({
        where: { id },
        data
    })
    revalidatePath("/")
    revalidatePath("/admin")
    return { success: true }
}

export async function deleteWish(id: string) {
    try {
        await prisma.wish.delete({ where: { id } })
        revalidatePath("/admin")
        revalidatePath("/wishes")
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete wish" }
    }
}

export async function getCompletedWishesCount() {
    return await prisma.wish.count({
        where: {
            status: "COMPLETED",
        },
    })
}
