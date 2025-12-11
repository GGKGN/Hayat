"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { Role } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { DEFAULT_PERMISSIONS, PERMISSIONS } from "@/lib/permissions"

// Helper to initialize permissions if they don't exist
async function ensurePermissionsInitialized() {
    for (const role of Object.keys(DEFAULT_PERMISSIONS) as Role[]) {
        const exists = await prisma.rolePermission.findUnique({
            where: { role }
        })

        if (!exists) {
            await prisma.rolePermission.create({
                data: {
                    role,
                    permissions: DEFAULT_PERMISSIONS[role]
                }
            })
        }
    }
}

export async function getRolePermissions() {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" }
    }

    try {
        await ensurePermissionsInitialized()

        const permissions = await prisma.rolePermission.findMany({
            orderBy: { role: 'asc' }
        })

        return { permissions }
    } catch (error) {
        console.error("Failed to fetch permissions:", error)
        return { error: "Failed to fetch permissions" }
    }
}

export async function updateRolePermissions(role: Role, permissions: string[]) {
    const session = await auth()
    if (!session || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" }
    }

    // Safety check: Prevent removing MANAGE_ROLES from ADMIN
    if (role === "ADMIN" && !permissions.includes(PERMISSIONS.MANAGE_ROLES)) {
        return { error: "Cannot remove role management permission from Admin" }
    }

    try {
        await prisma.rolePermission.upsert({
            where: { role },
            update: { permissions },
            create: { role, permissions }
        })

        revalidatePath("/admin")
        return { success: true }
    } catch (error) {
        console.error("Failed to update permissions:", error)
        return { error: "Failed to update permissions" }
    }
}

// Client-side helper to check permission (requires fetching permissions first or passing them down)
// Ideally, we'd cache this in the session, but for now we'll fetch it where needed or rely on server components
export async function checkPermission(permission: string) {
    const session = await auth()
    if (!session?.user?.role) return false

    const rolePerms = await prisma.rolePermission.findUnique({
        where: { role: session.user.role as Role }
    })

    if (!rolePerms) {
        // Fallback to defaults if DB entry missing
        return (DEFAULT_PERMISSIONS[session.user.role as Role] || []).includes(permission)
    }

    const perms = rolePerms.permissions as string[]
    return perms.includes(permission)
}

export async function getMyPermissions() {
    const session = await auth()
    if (!session?.user?.role) return []

    const rolePerms = await prisma.rolePermission.findUnique({
        where: { role: session.user.role as Role }
    })

    if (!rolePerms) {
        return DEFAULT_PERMISSIONS[session.user.role as Role] || []
    }

    const perms = rolePerms.permissions as string[]

    // SELF-HEALING: Check for legacy/broken permissions
    // Legacy perms were lowercase (e.g., 'manage_wishes') or missing MANAGE_WISHES for ADMIN
    const isAdmin = session.user.role === 'ADMIN'
    const hasLegacyPerm = perms.some(p => p === 'manage_wishes' || p === 'view_dashboard')
    const isMissingCriticalPerm = isAdmin && !perms.includes(PERMISSIONS.MANAGE_WISHES)

    if (hasLegacyPerm || isMissingCriticalPerm) {
        console.log(`[Permissions] Detected legacy/broken permissions for ${session.user.role}. Fixing...`)

        // Use defaults
        const newPerms = DEFAULT_PERMISSIONS[session.user.role as Role] || []

        // Update DB
        try {
            await prisma.rolePermission.update({
                where: { role: session.user.role as Role },
                data: { permissions: newPerms }
            })
            return newPerms
        } catch (e) {
            console.error("Failed to auto-fix permissions", e)
        }
    }

    return rolePerms.permissions as string[]
}
