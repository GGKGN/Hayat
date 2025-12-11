"use client"

import React, { useState } from "react"
import {
    LayoutDashboard,
    Gift,
    Calendar,
    Briefcase,
    FileText,
    Users,
    MessageSquare,
    Settings,
    MoreVertical,
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Clock,
    Plus,
    Trash2,
    Mail,
    Phone,
    MapPin,
    Save,
    Edit2,
    Shield,
    ShieldOff,
    Link as LinkIcon
} from "lucide-react"
import AdminSidebar from "./AdminSidebar"
import { updateWishStatus, deleteWish } from "@/actions/wishes"
import { createEvent, deleteEvent } from "@/actions/events"
import { useRouter } from "next/navigation"
import { createProject, deleteProject } from "@/actions/projects"
import { promoteUser, deleteUser, updateUserRole } from "@/actions/user"
import { toggleMessageReadStatus, deleteMessage } from "@/actions/contact"
import { createSupportPackage, deleteSupportPackage } from "@/actions/support"
import { deleteFeedback } from "@/actions/feedback"
import TeamsTab from "./TeamsTab"
import SettingsTab from "./SettingsTab"
import RolesTab from "./RolesTab"
import { PERMISSIONS } from "@/lib/permissions"
import DeleteMessageButton from "./DeleteMessageButton"
import DeleteFeedbackButton from "./DeleteFeedbackButton"

function StatusBadge({ status }: { status: string }) {
    const styles = {
        PENDING: "bg-yellow-100 text-yellow-800",
        IN_PROCESS: "bg-blue-100 text-blue-800",
        COMPLETED: "bg-green-100 text-green-800",
        ONGOING: "bg-blue-100 text-blue-800",
        ADMIN: "bg-purple-100 text-purple-800",
        MEMBER: "bg-gray-100 text-gray-800"
    }
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800"}`}>
            {status}
        </span>
    )
}

export default function AdminTabs({ wishes, events, projects, users, messages, contactInfo, teamsData, navSettings, supportPackages, feedbacks, permissions }: any) {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("wishes")
    const [search, setSearch] = useState("")

    // Forms State
    const [isEventFormOpen, setIsEventFormOpen] = useState(false)
    const [isProjectFormOpen, setIsProjectFormOpen] = useState(false)
    const [isSupportFormOpen, setIsSupportFormOpen] = useState(false)

    // Helper to filter data based on search
    const filterData = (data: any[], keys: string[]) => {
        if (!search) return data
        return data.filter(item =>
            keys.some(key => item[key]?.toString().toLowerCase().includes(search.toLowerCase()))
        )
    }

    // Handlers
    async function handleUpdateWishStatus(id: string, newStatus: "PENDING" | "IN_PROCESS" | "COMPLETED") {
        await updateWishStatus(id, newStatus)
    }

    async function handleCreateEvent(formData: FormData) {
        await createEvent(formData)
        setIsEventFormOpen(false)
        alert("Etkinlik oluşturuldu!")
    }

    async function handleCreateProject(formData: FormData) {
        await createProject(formData)
        setIsProjectFormOpen(false)
        alert("Proje oluşturuldu!")
    }

    async function handleCreateSupportPackage(formData: FormData) {
        await createSupportPackage(formData)
        setIsSupportFormOpen(false)
        alert("Destek paketi oluşturuldu!")
    }

    async function handleUserRoleUpdate(id: string, newRole: "ADMIN" | "MEMBER" | "USER") {
        const result = await updateUserRole(id, newRole)
        if (result.success) {
            router.refresh()
        } else {
            alert("Hata: Rol güncellenemedi.")
        }
    }

    const [isPending, startTransition] = React.useTransition()

    async function handleToggleMessageRead(id: string, currentStatus: boolean) {
        const result = await toggleMessageReadStatus(id, currentStatus)
        if (result.success) {
            router.refresh()
        }
    }

    // Render Content Based on Tab
    const renderContent = () => {
        // Permission Checks
        if (activeTab === 'wishes' && !permissions?.includes(PERMISSIONS.MANAGE_WISHES)) return <div className="p-8 text-center text-red-500 font-bold">Yetkiniz yok.</div>
        if (activeTab === 'events' && !permissions?.includes(PERMISSIONS.MANAGE_EVENTS)) return <div className="p-8 text-center text-red-500 font-bold">Yetkiniz yok.</div>
        if (activeTab === 'projects' && !permissions?.includes(PERMISSIONS.MANAGE_PROJECTS)) return <div className="p-8 text-center text-red-500 font-bold">Yetkiniz yok.</div>
        if (activeTab === 'teams' && !permissions?.includes(PERMISSIONS.MANAGE_TEAMS)) return <div className="p-8 text-center text-red-500 font-bold">Yetkiniz yok.</div>
        if (activeTab === 'support' && !permissions?.includes(PERMISSIONS.MANAGE_SUPPORT)) return <div className="p-8 text-center text-red-500 font-bold">Yetkiniz yok.</div>
        if (activeTab === 'feedbacks' && !permissions?.includes(PERMISSIONS.MANAGE_FEEDBACK)) return <div className="p-8 text-center text-red-500 font-bold">Yetkiniz yok.</div>
        if (activeTab === 'messages' && !permissions?.includes(PERMISSIONS.MANAGE_MESSAGES)) return <div className="p-8 text-center text-red-500 font-bold">Yetkiniz yok.</div>
        if (activeTab === 'reports' && !permissions?.includes(PERMISSIONS.MANAGE_REPORTS)) return <div className="p-8 text-center text-red-500 font-bold">Yetkiniz yok.</div>
        if (activeTab === 'users' && !permissions?.includes(PERMISSIONS.MANAGE_USERS)) return <div className="p-8 text-center text-red-500 font-bold">Yetkiniz yok.</div>
        if (activeTab === 'roles' && !permissions?.includes(PERMISSIONS.MANAGE_ROLES)) return <div className="p-8 text-center text-red-500 font-bold">Yetkiniz yok.</div>
        if (activeTab === 'settings' && !permissions?.includes(PERMISSIONS.MANAGE_SETTINGS)) return <div className="p-8 text-center text-red-500 font-bold">Yetkiniz yok.</div>

        switch (activeTab) {
            // ... cases ...
            case "feedbacks":
                return (
                    <div className="space-y-4">
                        {feedbacks?.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100">
                                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">Henüz hiç geri bildirim yok.</p>
                            </div>
                        ) : (
                            feedbacks?.map((fb: any) => (
                                <div key={fb.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
                                                <MessageSquare className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800">Anonim Geri Bildirim</h3>
                                                <p className="text-xs text-gray-500">{new Date(fb.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                        <DeleteFeedbackButton id={fb.id} />
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        {fb.content}
                                    </p>
                                </div>
                            ))
                        )
                        }
                    </div >
                )
            case "teams":
                return <TeamsTab teams={teamsData.teams} roles={teamsData.roles} members={teamsData.members} users={users} />

            case "wishes":
                const filteredWishes = filterData(wishes, ['title', 'status'])
                return (
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-6 font-bold text-gray-600 text-sm">Başlık</th>
                                        <th className="p-6 font-bold text-gray-600 text-sm">Kullanıcı</th>
                                        <th className="p-6 font-bold text-gray-600 text-sm">Durum</th>
                                        <th className="p-6 font-bold text-gray-600 text-sm">Tarih</th>
                                        <th className="p-6 font-bold text-gray-600 text-sm text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredWishes.map((wish: any) => (
                                        <tr key={wish.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="p-6 font-bold text-gray-800">{wish.title}</td>
                                            <td className="p-6 flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold mr-3">
                                                    {wish.user?.name?.[0] || "?"}
                                                </div>
                                                <span className="text-sm text-gray-600">{wish.user?.name || "Anonim"}</span>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2">
                                                    <StatusBadge status={wish.status} />
                                                    <div className="flex rounded-lg bg-gray-100 p-1">
                                                        {(["PENDING", "IN_PROCESS", "COMPLETED"] as const).map(s => (
                                                            <button
                                                                key={s}
                                                                onClick={() => handleUpdateWishStatus(wish.id, s)}
                                                                className={`w-4 h-4 rounded-full ${wish.status === s ? 'ring-2 ring-white shadow-sm' : 'opacity-30 hover:opacity-100'} ${s === 'COMPLETED' ? 'bg-green-500' : s === 'IN_PROCESS' ? 'bg-blue-500' : 'bg-yellow-500'}`}
                                                                title={s}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6 text-sm text-gray-500">{new Date(wish.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'numeric', year: 'numeric' })}</td>
                                            <td className="p-6 text-right">
                                                <button onClick={() => deleteWish(wish.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )

            case "events":
                const filteredEvents = filterData(events, ['title', 'location'])
                return (
                    <div className="space-y-6">
                        <div className="flex justify-end">
                            <button onClick={() => setIsEventFormOpen(!isEventFormOpen)} className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-gray-200">
                                {isEventFormOpen ? <XCircle className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                {isEventFormOpen ? 'Vazgeç' : 'Yeni Etkinlik'}
                            </button>
                        </div>

                        {isEventFormOpen && (
                            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl animate-in fade-in slide-in-from-top-4">
                                <h3 className="text-xl font-bold mb-6">Yeni Etkinlik Oluştur</h3>
                                <form action={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Etkinlik Başlığı</label>
                                        <input name="title" required className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20" placeholder="Örn: Doğa Yürüyüşü" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Tarih</label>
                                        <input type="datetime-local" name="date" required className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Konum</label>
                                        <input name="location" required className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20" placeholder="Örn: Ayder Yaylası" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Kapak Görseli URL</label>
                                        <input name="coverImage" className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20" placeholder="https://..." />
                                    </div>
                                    <div className="md:col-span-2">
                                        <button className="w-full bg-primary text-white p-4 rounded-xl font-bold hover:bg-primary/90 transition-all">Oluştur</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredEvents.map((event: any) => (
                                <div key={event.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col group hover:shadow-md transition-all">
                                    <div className="h-40 bg-gray-100 rounded-2xl mb-4 overflow-hidden relative">
                                        {event.coverImage ? (
                                            <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-300"><Calendar className="w-10 h-10" /></div>
                                        )}
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-700">
                                            {new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'numeric', year: 'numeric' })}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-1">{event.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4 flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</p>
                                    <div className="mt-auto pt-4 border-t border-gray-50 flex justify-end">
                                        <button onClick={() => deleteEvent(event.id)} className="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )

            case "projects":
                const filteredProjects = filterData(projects, ['title', 'status'])
                return (
                    <div className="space-y-6">
                        <div className="flex justify-end">
                            <button onClick={() => setIsProjectFormOpen(!isProjectFormOpen)} className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-gray-200">
                                {isProjectFormOpen ? <XCircle className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                {isProjectFormOpen ? 'Vazgeç' : 'Yeni Proje'}
                            </button>
                        </div>

                        {isProjectFormOpen && (
                            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl animate-in fade-in slide-in-from-top-4">
                                <h3 className="text-xl font-bold mb-6">Yeni Proje Başlat</h3>
                                <form action={handleCreateProject} className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Proje Adı</label>
                                        <input name="title" required className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20" placeholder="Örn: Kütüphane Kurulumu" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Açıklama</label>
                                        <textarea name="description" rows={3} required className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20" placeholder="Proje detayları..." />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Görsel URL</label>
                                        <input name="image" className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20" placeholder="https://..." />
                                    </div>
                                    <div className="md:col-span-2">
                                        <button className="w-full bg-primary text-white p-4 rounded-xl font-bold hover:bg-primary/90 transition-all">Oluştur</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredProjects.map((project: any) => (
                                <div key={project.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 group">
                                    <div className="w-full md:w-32 h-32 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                                        {project.image ? (
                                            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-300"><Briefcase className="w-8 h-8" /></div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <StatusBadge status={project.status} />
                                            <button onClick={() => deleteProject(project.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">{project.title}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )

            case "users":
                const filteredUsers = filterData(users, ['name', 'email', 'role'])
                return (
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-6 font-bold text-gray-600 text-sm">Kullanıcı</th>
                                        <th className="p-6 font-bold text-gray-600 text-sm">E-Posta</th>
                                        <th className="p-6 font-bold text-gray-600 text-sm">Rol</th>
                                        <th className="p-6 font-bold text-gray-600 text-sm">Kayıt Tarihi</th>
                                        <th className="p-6 font-bold text-gray-600 text-sm text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredUsers.map((user: any) => (
                                        <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-6 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-black text-gray-500">
                                                    {user.name?.[0]}
                                                </div>
                                                <span className="font-bold text-gray-800">{user.name}</span>
                                            </td>
                                            <td className="p-6 text-sm text-gray-600">{user.email}</td>
                                            <td className="p-6">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleUserRoleUpdate(user.id, e.target.value as "ADMIN" | "MEMBER" | "USER")}
                                                    className={`px-3 py-2 rounded-lg text-xs font-bold border-none outline-none cursor-pointer transition-colors ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                                                        user.role === 'MEMBER' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    <option value="USER">USER</option>
                                                    <option value="MEMBER">MEMBER</option>
                                                    <option value="ADMIN">ADMIN</option>
                                                </select>
                                            </td>
                                            <td className="p-6 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'numeric', year: 'numeric' })}</td>
                                            <td className="p-6 text-right flex items-center justify-end gap-2">
                                                <button onClick={() => deleteUser(user.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )

            case "messages":
                return (
                    <div className="space-y-4">
                        {messages.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100">
                                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">Henüz hiç mesaj yok.</p>
                            </div>
                        ) : (
                            messages.map((msg: any) => (
                                <div key={msg.id} className={`bg-white rounded-2xl p-6 border transition-all ${msg.isRead ? 'border-gray-100 opacity-75' : 'border-blue-100 shadow-sm shadow-blue-50'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${msg.isRead ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600'}`}>
                                                <Mail className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800">{msg.subject}</h3>
                                                <p className="text-xs text-gray-500">{msg.name} ({msg.email})</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400 mr-2">{new Date(msg.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'numeric', year: 'numeric' })}</span>
                                            <button
                                                onClick={() => handleToggleMessageRead(msg.id, msg.isRead)}
                                                className={`p-2 rounded-lg text-xs font-bold transition-colors ${msg.isRead ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                                            >
                                                {msg.isRead ? 'Okundu İşaretini Kaldır' : 'Okundu Olarak İşaretle'}
                                            </button>
                                            <DeleteMessageButton id={msg.id} />
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        {msg.message}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                )

            case "support":
                return (
                    <div className="space-y-6">
                        <div className="flex justify-end">
                            <button onClick={() => setIsSupportFormOpen(!isSupportFormOpen)} className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-gray-200">
                                {isSupportFormOpen ? <XCircle className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                {isSupportFormOpen ? 'Vazgeç' : 'Yeni Destek Paketi'}
                            </button>
                        </div>

                        {isSupportFormOpen && (
                            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl animate-in fade-in slide-in-from-top-4">
                                <h3 className="text-xl font-bold mb-6">Yeni Destek Paketi Oluştur</h3>
                                <form action={handleCreateSupportPackage} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Paket Adı</label>
                                        <input name="name" required className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20" placeholder="Örn: Kahve Ismarla" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Fiyat</label>
                                        <input name="price" required className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20" placeholder="Örn: 50 TL" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-bold text-gray-700">İçerik Açıklaması</label>
                                        <textarea name="content" rows={2} required className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20" placeholder="Paket detayları..." />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Ürün Linki</label>
                                        <input name="link" required className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20" placeholder="https://iyzico..." />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Görsel URL (Boş bırakılırsa hediye kutusu olur)</label>
                                        <input name="image" className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20" placeholder="https://..." />
                                    </div>
                                    <div className="md:col-span-2">
                                        <button className="w-full bg-primary text-white p-4 rounded-xl font-bold hover:bg-primary/90 transition-all">Oluştur</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {supportPackages?.map((pkg: any) => (
                                <div key={pkg.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col group hover:shadow-md transition-all">
                                    <div className="h-40 bg-gray-50 rounded-2xl mb-4 overflow-hidden relative flex items-center justify-center border border-gray-100">
                                        {pkg.image ? (
                                            <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <Gift className="w-16 h-16 text-red-500 drop-shadow-sm" />
                                        )}
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm ring-1 ring-gray-100">
                                            {pkg.price}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-primary transition-colors">{pkg.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{pkg.content}</p>
                                    <a href={pkg.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 font-bold hover:underline mb-4 block truncate flex items-center gap-1">
                                        <LinkIcon className="w-3 h-3" />
                                        {pkg.link}
                                    </a>
                                    <div className="mt-auto pt-4 border-t border-gray-50 flex justify-end">
                                        <button onClick={() => deleteSupportPackage(pkg.id)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {supportPackages?.length === 0 && (
                                <div className="col-span-full text-center py-20 bg-gray-50 rounded-[2rem] border border-gray-100 border-dashed">
                                    <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 font-medium">Henüz destek paketi oluşturulmadı.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )

            case "feedbacks":
                return (
                    <div className="space-y-4">
                        {feedbacks?.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100">
                                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">Henüz hiç geri bildirim yok.</p>
                            </div>
                        ) : (
                            feedbacks?.map((fb: any) => (
                                <div key={fb.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
                                                <MessageSquare className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800">Anonim Geri Bildirim</h3>
                                                <p className="text-xs text-gray-500">{new Date(fb.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                        <DeleteFeedbackButton id={fb.id} />
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        {fb.content}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                )

            case "roles":
                return <RolesTab />
            case "settings":
                return <SettingsTab contactInfo={contactInfo} navSettings={navSettings} />

            default:
                return null
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} permissions={permissions} />

            <main className="flex-1 p-8 pt-36 ml-64 overflow-y-auto h-screen">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-gray-800 capitalize translate-y-1">
                                {activeTab === 'teams' && 'Takım Yönetimi'}
                                {activeTab === 'wishes' && 'Dilek Yönetimi'}
                                {activeTab === 'events' && 'Etkinlikler'}
                                {activeTab === 'projects' && 'Projeler'}
                                {activeTab === 'users' && 'Kullanıcılar'}
                                {activeTab === 'messages' && 'Mesaj Kutusu'}
                                {activeTab === 'support' && 'Destek Ol'}
                                {activeTab === 'feedbacks' && 'Geri Bildirimler'}
                                {activeTab === 'roles' && 'Rol ve Yetki Yönetimi'}
                                {activeTab === 'settings' && 'Ayarlar'}
                            </h1>
                            <p className="text-gray-500 text-sm mt-2">Yönetim paneline hoşgeldiniz.</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            {/* Show Search only if supported tab */}
                            {['wishes', 'events', 'projects', 'users'].includes(activeTab) && (
                                <div className="relative">
                                    <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Ara..."
                                        className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-primary w-64 bg-white"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                        {renderContent()}
                    </div>

                </div>
            </main>
        </div>
    )
}
