"use server"

import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"
import nodemailer from "nodemailer"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
    },
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
})

export async function requestPasswordReset(email: string) {
    console.log("Password Reset Requested for:", email) // Log start

    if (!SMTP_USER || !SMTP_PASS) {
        console.error("SMTP Credentials missing")
        return { error: "SMTP config is missing. Please check server logs." }
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        console.log("User not found for email:", email)
        // Return success even if user not found to prevent enumeration
        return { success: true, message: "Eğer bu email sistemde kayıtlıysa, sıfırlama bağlantısı gönderildi." }
    }

    // Generate secure token
    const token = randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 3600000) // 1 hour

    // Save token
    await prisma.passwordResetToken.create({
        data: {
            email,
            token,
            expires
        }
    })
    console.log("Token generated and saved")

    // Send Email
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${token}`

    try {
        console.log("Attempting to send email via Nodemailer...")
        await transporter.sendMail({
            from: `"Hayat Destek" <${SMTP_USER}>`,
            to: email,
            subject: "Şifre Sıfırlama İsteği",
            html: `
                <h1>Şifre Sıfırlama</h1>
                <p>Hesabınız için şifre sıfırlama talebi aldık.</p>
                <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
                <a href="${resetUrl}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Şifremi Sıfırla</a>
                <p>Bu bağlantı 1 saat geçerlidir.</p>
                <p>Eğer bu talebi siz yapmadıysanız, bu emaili görmezden gelebilirsiniz.</p>
            `
        })
        console.log("Email sent successfully")
        return { success: true, message: "Sıfırlama bağlantısı gönderildi." }

    } catch (error) {
        console.error("Email send error:", error)
        return { error: "Email gönderilirken hata oluştu." }
    }
}

export async function resetPassword(token: string, password: string) {
    // Validate token
    const storedToken = await prisma.passwordResetToken.findUnique({ where: { token } })

    if (!storedToken) return { error: "Geçersiz veya süresi dolmuş bağlantı." }

    if (new Date() > storedToken.expires) {
        // Cleanup expired
        await prisma.passwordResetToken.delete({ where: { token } })
        return { error: "Bağlantının süresi dolmuş." }
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update User
    await prisma.user.update({
        where: { email: storedToken.email },
        data: { password: hashedPassword }
    })

    // Cleanup used token (and potentially all tokens for this user)
    await prisma.passwordResetToken.deleteMany({
        where: { email: storedToken.email }
    })

    return { success: true }
}
