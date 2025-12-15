"use client"

import React, { useState } from "react"
import {
    Search,
    Filter,
    MoreVertical,
    Trash2,
    Edit2,
    Plus,
    CheckCircle,
    XCircle,
    Phone,
    Mail,
    ChevronLeft,
    ChevronRight,
    User as UserIcon
} from "lucide-react"
import { deleteUser, updateUser, createUser } from "@/actions/user"
import { useRouter } from "next/navigation"

function StatusBadge({ status }: { status: string }) {
    const styles = {
        ACTIVE: "bg-green-100 text-green-700",
        PENDING: "bg-yellow-100 text-yellow-700",
        INACTIVE: "bg-red-100 text-red-700",
    }
    const labels = {
        ACTIVE: "Aktif",
        PENDING: "Beklemede",
        INACTIVE: "Pasif",
    }
    // Fallback for old data or unmapped statuses
    const statusKey = status as keyof typeof styles
    const style = styles[statusKey] || "bg-gray-100 text-gray-700"
    const label = labels[statusKey] || status

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${style}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'ACTIVE' ? 'bg-green-500' : status === 'PENDING' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
            {label}
        </span>
    )
}

function RoleBadge({ role }: { role: string }) {
    const styles = {
        ADMIN: "bg-blue-100 text-blue-700",
        MEMBER: "bg-purple-100 text-purple-700",
        USER: "bg-gray-100 text-gray-700",
    }
    const labels = {
        ADMIN: "Yönetici",
        MEMBER: "Üye",
        USER: "Kullanıcı",
    }
    const roleKey = role as keyof typeof styles
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[roleKey] || styles.USER}`}>
            {labels[roleKey] || role}
        </span>
    )
}

function OnlineStatus({ lastActive }: { lastActive: string | Date | null }) {
    if (!lastActive) return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">Çevrimdışı</span>

    const lastActiveDate = new Date(lastActive)
    const now = new Date()
    const diffMinutes = (now.getTime() - lastActiveDate.getTime()) / (1000 * 60)
    const isOnline = diffMinutes < 5

    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold gap-1 ${isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
            {isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
            {!isOnline && diffMinutes < 60 && <span className="text-[10px] opacity-75">({Math.floor(diffMinutes)} dk)</span>}
        </span>
    )
}

export default function UserManagementTab({ users }: { users: any[] }) {
    const router = useRouter()
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState("ALL")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)

    // Filter Logic
    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.name?.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase()) ||
            user.faculty?.toLowerCase().includes(search.toLowerCase()))
        const matchesRole = roleFilter === "ALL" || user.role === roleFilter
        // Use user.status or default to ACTIVE/PENDING if null?
        // Assuming undefined/null status maps to something or we check existence.
        // If status is missing in old data, we might want to show it.
        const userStatus = user.status || "PENDING"
        const matchesStatus = statusFilter === "ALL" || userStatus === statusFilter

        return matchesSearch && matchesRole && matchesStatus
    })

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return
        setCurrentPage(page)
    }

    // Handlers
    async function handleDelete(id: string) {
        if (confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
            await deleteUser(id)
            router.refresh()
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            role: formData.get("role"),
            status: formData.get("status"),
            phoneNumber: formData.get("phoneNumber"),
            faculty: formData.get("faculty"),
            grade: formData.get("grade"),
            // password handled for new users if needed, or ignored for updates
            password: editingUser ? undefined : "$2b$10$DefaultHash..." // Should really be handled securely
        }

        if (editingUser) {
            await updateUser(editingUser.id, data)
        } else {
            await createUser(data)
        }

        setIsLoading(false)
        setIsModalOpen(false)
        setEditingUser(null)
        router.refresh()
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    {/* Breadcrumb could go here if parent doesn't provide it */}
                    <nav className="flex text-sm text-gray-500 mb-1">
                        <span>Ana Sayfa</span>
                        <span className="mx-2">/</span>
                        <span>Yönetim Paneli</span>
                        <span className="mx-2">/</span>
                        <span className="font-bold text-gray-800">Üye Yönetimi</span>
                    </nav>
                    <h1 className="text-3xl font-bold text-gray-900">Üye Yönetimi</h1>
                    <p className="text-gray-500 mt-1">Kulüp üyelerini listeleyin, yetkilerini düzenleyin ve durumlarını yönetin.</p>
                </div>
                <button
                    onClick={() => { setEditingUser(null); setIsModalOpen(true) }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
                >
                    <Plus className="w-5 h-5" />
                    Yeni Üye Ekle
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ARAMA</label>
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="İsim, e-posta veya fakülte ara..."
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-700 placeholder-gray-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">ROL</label>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-700 cursor-pointer appearance-none"
                    >
                        <option value="ALL">Tüm Roller</option>
                        <option value="ADMIN">Yönetici</option>
                        <option value="MEMBER">Üye</option>
                        <option value="USER">Kullanıcı</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">DURUM</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-700 cursor-pointer appearance-none"
                    >
                        <option value="ALL">Tüm Durumlar</option>
                        <option value="ACTIVE">Aktif</option>
                        <option value="PENDING">Beklemede</option>
                        <option value="INACTIVE">Pasif</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="text-left p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">ÜYE BİLGİSİ</th>
                                <th className="text-left p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">İLETİŞİM</th>
                                <th className="text-left p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">ROL</th>
                                <th className="text-left p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">DURUM</th>
                                <th className="text-left p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">ONLINE</th>
                                <th className="text-left p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">KAYIT TARİHİ</th>
                                <th className="text-right p-6 text-xs font-bold text-gray-500 uppercase tracking-wider">İŞLEMLER</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            {user.image ? (
                                                <img src={user.image} alt={user.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xl">
                                                    {user.name?.[0]?.toUpperCase() || <UserIcon className="w-6 h-6" />}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-bold text-gray-900">{user.name}</div>
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    {user.faculty} {user.grade ? `• ${user.grade}` : ""}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail className="w-3.5 h-3.5 text-gray-400" />
                                                {user.email}
                                            </div>
                                            {user.phoneNumber && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                    {user.phoneNumber}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <RoleBadge role={user.role} />
                                    </td>
                                    <td className="p-6">
                                        <StatusBadge status={user.status || "PENDING"} />
                                    </td>
                                    <td className="p-6">
                                        <OnlineStatus lastActive={user.lastActive} />
                                    </td>
                                    <td className="p-6 text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        <div className="text-xs text-gray-400 mt-1">
                                            {new Date(user.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => { setEditingUser(user); setIsModalOpen(true) }}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        <span className="font-bold text-gray-900">{filteredUsers.length}</span> üyeden <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> arası gösteriliyor
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">{editingUser ? 'Üye Düzenle' : 'Yeni Üye Ekle'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <XCircle className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Ad Soyad</label>
                                    <input name="name" defaultValue={editingUser?.name} required className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-100" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">E-Posta</label>
                                    <input name="email" type="email" defaultValue={editingUser?.email} required className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-100" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Telefon</label>
                                    <input name="phoneNumber" defaultValue={editingUser?.phoneNumber} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-100" placeholder="+90 555..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Fakülte</label>
                                    <input name="faculty" defaultValue={editingUser?.faculty} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-100" placeholder="Tıp Fakültesi" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Sınıf/Sıfat</label>
                                    <input name="grade" defaultValue={editingUser?.grade} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-100" placeholder="3. Sınıf" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Rol</label>
                                    <select name="role" defaultValue={editingUser?.role || "USER"} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-100 cursor-pointer">
                                        <option value="USER">Kullanıcı</option>
                                        <option value="MEMBER">Üye</option>
                                        <option value="ADMIN">Yönetici</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Durum</label>
                                    <select name="status" defaultValue={editingUser?.status || "ACTIVE"} className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-100 cursor-pointer">
                                        <option value="ACTIVE">Aktif</option>
                                        <option value="PENDING">Beklemede</option>
                                        <option value="INACTIVE">Pasif</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold hover:bg-gray-50 text-gray-600 transition-colors">Vazgeç</button>
                                <button disabled={isLoading} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50">
                                    {isLoading ? 'İşleniyor...' : (editingUser ? 'Güncelle' : 'Oluştur')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
