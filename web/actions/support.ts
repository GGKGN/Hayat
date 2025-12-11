"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createSupportPackage(formData: FormData) {
    const name = formData.get("name") as string
    const content = formData.get("content") as string
    const price = formData.get("price") as string
    const link = formData.get("link") as string
    let image = formData.get("image") as string // URL

    if (!image) {
        // Default red gift box image
        image = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2040&auto=format&fit=crop"
    }

    try {
        await prisma.supportPackage.create({
            data: {
                name,
                content,
                price,
                link,
                image
            }
        })
        revalidatePath("/admin")
        revalidatePath("/support")
        return { success: true }
    } catch (e: any) {
        console.error("Support package creation error:", e)
        return { error: "Failed to create package: " + (e.message || e) }
    }
}

export async function deleteSupportPackage(id: string) {
    try {
        await prisma.supportPackage.delete({ where: { id } })
        revalidatePath("/admin")
        revalidatePath("/support")
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete package" }
    }
}

export async function getSupportPackages() {
    return await prisma.supportPackage.findMany({
        orderBy: {
            price: 'asc' // Sort by price usually makes sense, or createdAt
        }
    })
}
