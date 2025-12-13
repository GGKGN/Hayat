"use client"

import { useState, use } from "react"
import { resetPassword } from "@/actions/auth-reset"
import { useRouter } from "next/navigation"
import { Lock, Loader2, CheckCircle, Eye, EyeOff } from "lucide-react"

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const { token } = use(params)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")

        if (password.length < 6) {
            setError("Şifre en az 6 karakter olmalıdır.")
            return
        }

        if (password !== confirmPassword) {
            setError("Şifreler eşleşmiyor.")
            return
        }

        setIsLoading(true)

        try {
            const res = await resetPassword(token, password)
            if (res.success) {
                setSuccess(true)
                setTimeout(() => {
                    router.push("/login")
                }, 3000)
            } else {
                setError(res.error || "Sıfırlama başarısız.")
            }
        } catch (err) {
            setError("Sunucu hatası.")
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-md p-12 rounded-[2rem] shadow-xl border border-gray-100 text-center">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 mb-4">Şifreniz Değiştirildi! 🎉</h2>
                    <p className="text-gray-500 font-medium mb-8">
                        Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md p-8 rounded-[2rem] shadow-xl border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-800 mb-2">Yeni Şifre Belirle</h1>
                    <p className="text-gray-500 text-sm">Lütfen hesabınız için yeni ve güvenli bir şifre belirleyin.</p>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl mb-6 text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Yeni Şifre</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-50 border-none rounded-xl p-4 font-medium text-gray-800 focus:ring-2 focus:ring-purple-100 transition-all pr-12"
                                placeholder="******"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Yeni Şifre (Tekrar)</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-xl p-4 font-medium text-gray-800 focus:ring-2 focus:ring-purple-100 transition-all"
                            placeholder="******"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white p-4 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-70 disabled:scale-100"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Şifreyi Güncelle"}
                    </button>
                </form>
            </div>
        </div>
    )
}
