"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Camera, Loader2, User, ShieldCheck, Edit2 } from "lucide-react"
import { uploadProfileImage } from "@/actions/upload"

export default function ProfileHeader({ user }: { user: any }) {
    const { update } = useSession()
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    // Edit Form State
    const [name, setName] = useState(user.name || "")
    const [title, setTitle] = useState(user.title || "")
    const [bio, setBio] = useState(user.bio || "")

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        // 5MB Limit Check
        if (file.size > 5 * 1024 * 1024) {
            alert("Dosya boyutu 5MB'dan küçük olmalıdır.")
            return
        }

        setIsUploading(true)
        const formData = new FormData()
        formData.append("file", file)

        const res = await uploadProfileImage(user.id, formData)

        if (res.success && res.imageUrl) {
            await update({ image: res.imageUrl })
        }

        setIsUploading(false)
        router.refresh()
    }

    async function handleUpdateProfile(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)

        // Dynamic import to avoid circular dependency issues or ensure updated schema is used
        const { updateUserProfile } = await import("@/actions/user")
        await updateUserProfile(user.id, { name, title, bio })

        setIsLoading(false)
        setIsEditOpen(false)
        router.refresh()
    }

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 mb-8 relative overflow-hidden">
            {/* Edit Modal */}
            {isEditOpen && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Profili Düzenle</h3>
                            <button onClick={() => setIsEditOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <User className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Ad Soyad</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-primary/20 font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Unvan</label>
                                <select
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-primary/20 font-medium appearance-none"
                                >
                                    <option value="">Seçiniz...</option>
                                    <option value="Öğrenci">Öğrenci</option>
                                    <option value="Stajyer">Stajyer</option>
                                    <option value="İntern Doktor">İntern Doktor</option>
                                    <option value="Doktor">Doktor</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Özgeçmiş</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={4}
                                    className="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-primary/20 font-medium resize-none"
                                    placeholder="Kendinizden bahsedin..."
                                ></textarea>
                            </div>

                            <button
                                disabled={isLoading}
                                className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all hover:shadow-lg mt-4 disabled:opacity-50"
                            >
                                {isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/10 to-accent/10"></div>

            <div className="relative flex flex-col md:flex-row items-center gap-6 md:items-end -mt-4">
                {/* Profile Image with Upload Button */}
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                        {isUploading ? (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                        ) : null}

                        {user.image ? (
                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-12 h-12 text-gray-400" />
                        )}
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="absolute bottom-0 right-0 bg-white text-gray-700 p-2 rounded-full shadow-md border border-gray-100 hover:text-primary transition-colors disabled:opacity-50"
                        title="Fotoğrafı Değiştir"
                    >
                        <Camera className="w-4 h-4" />
                    </button>
                </div>

                {/* User Info */}
                <div className="text-center md:text-left flex-1 mb-2">
                    <h1 className="text-3xl font-black text-gray-800">{user.name}</h1>
                    <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start mt-2">
                        <p className="text-gray-500 font-medium text-sm">{user.email}</p>

                        {user.title && (
                            <>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="text-primary font-bold text-sm">{user.title}</span>
                            </>
                        )}

                        <span className="hidden md:inline w-1 h-1 bg-gray-300 rounded-full"></span>

                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                            ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                            {user.role === 'ADMIN' ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                            {user.role === 'ADMIN' ? 'Yönetici' : 'Üye'}
                        </span>

                        <button
                            onClick={() => setIsEditOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-primary hover:text-white transition-all text-xs font-bold"
                        >
                            <Edit2 className="w-3 h-3" />
                            <span>Düzenle</span>
                        </button>
                    </div>
                    {user.bio && (
                        <p className="mt-4 text-gray-600 max-w-2xl text-sm leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100/50">
                            {user.bio}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
