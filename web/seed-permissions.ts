
import { PrismaClient } from "@prisma/client"
import { DEFAULT_PERMISSIONS } from "./lib/permissions"

const prisma = new PrismaClient()

async function main() {
    console.log("Seeding permissions...")

    for (const [role, permissions] of Object.entries(DEFAULT_PERMISSIONS)) {
        console.log(`Setting permissions for ${role}...`)
        await prisma.rolePermission.upsert({
            where: { role: role as any },
            update: { permissions },
            create: {
                role: role as any,
                permissions
            }
        })
    }

    console.log("Permissions seeded successfully.")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
