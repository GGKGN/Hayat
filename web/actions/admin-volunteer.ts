"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { updateSiteSetting } from "./settings"

export async function getVolunteerApplications() {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") return []

    return await prisma.volunteerApplication.findMany({
        include: {
            user: true,
            team: true
        },
        orderBy: { createdAt: 'desc' }
    })
}

export async function updateApplicationStatus(id: string, status: "APPROVED" | "REJECTED") {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" }

    try {
        const app = await prisma.volunteerApplication.update({
            where: { id },
            data: { status }
        })

        if (status === "APPROVED") {
            // Upgrade user to MEMBER
            await prisma.user.update({
                where: { id: app.userId },
                data: { role: "MEMBER" }
            })
        }

        revalidatePath("/admin")
        return { success: true }
    } catch (e) {
        return { error: "Failed to update status" }
    }
}

export async function deleteApplication(id: string) {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" }

    try {
        await prisma.volunteerApplication.delete({
            where: { id }
        })
        revalidatePath("/admin")
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete application" }
    }
}

export async function toggleVolunteerSystem(isOpen: boolean) {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" }

    return await updateSiteSetting("VOLUNTEER_SYS_OPEN", isOpen ? "true" : "false")
}

// Question Management
export async function getAllQuestions() {
    // Admin needs to see all including inactive?
    return await prisma.volunteerQuestion.findMany({
        orderBy: { order: 'asc' }
    })
}

export async function createQuestion(text: string) {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" }

    // Get max order
    const max = await prisma.volunteerQuestion.findFirst({ orderBy: { order: 'desc' } })
    const order = (max?.order || 0) + 1

    await prisma.volunteerQuestion.create({
        data: { text, order }
    })
    revalidatePath("/admin")
    return { success: true }
}

export async function deleteQuestion(id: string) {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" }

    await prisma.volunteerQuestion.delete({ where: { id } })
    revalidatePath("/admin")
    return { success: true }
}

export async function updateQuestionStatus(id: string, isActive: boolean) {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" }

    await prisma.volunteerQuestion.update({ where: { id }, data: { isActive } })
    revalidatePath("/admin")
    return { success: true }
}
