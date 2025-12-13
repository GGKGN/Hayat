
"use client"

import React, { useState } from "react"
import { Event } from "@prisma/client"
import { Search, Filter, Calendar, MapPin, CheckCircle2, Clock, Plus, XCircle, Edit2, Trash2, Image as ImageIcon, ChevronDown } from "lucide-react"
import { createEvent, updateEvent, deleteEvent } from "@/actions/events"
import { uploadEventImage } from "@/actions/upload"
import { useRouter } from "next/navigation"

interface EventManagementTabProps {
    events: Event[]
}

const FilterDropdown = ({
    label,
    value,
    options,
    onChange
}: {
    label: string,
    value: string,
    options: { value: string, label: string }[],
    onChange: (val: string) => void
}) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className="relative group">
            <button
                onClick={() => setIsOpen(!isOpen)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                className={`flex items-center gap-2 px-4 py-3 bg-white border border-gray-100 rounded-xl font-bold text-sm text-gray-600 hover:border-blue-200 hover:shadow-sm transition-all ${isOpen ? 'ring-2 ring-blue-100 border-blue-200' : ''}`}
            >
                {label}: <span className="text-gray-900">{options.find(o => o.value === value)?.label || "Tümü"}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 w-48 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => { onChange(opt.value); setIsOpen(false) }}
                            className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-gray-50 flex items-center justify-between ${value === opt.value ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                        >
                            {opt.label}
                            {value === opt.value && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

const AnimatedCounter = ({ value, duration = 1500 }: { value: number, duration?: number }) => {
    const [count, setCount] = useState(0)

    React.useEffect(() => {
        let startTime: number | null = null
        let animationFrameId: number

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = timestamp - startTime
            const percentage = Math.min(progress / duration, 1)
            const easeOutQuart = 1 - Math.pow(1 - percentage, 4)
            setCount(Math.floor(easeOutQuart * value))

            if (progress < duration) {
                animationFrameId = requestAnimationFrame(animate)
            } else {
                setCount(value)
            }
        }
        animationFrameId = requestAnimationFrame(animate)
        return () => { if (animationFrameId) cancelAnimationFrame(animationFrameId) }
    }, [value, duration])

    return <>{count}</>
}

export default function EventManagementTab({ events }: EventManagementTabProps) {
    const router = useRouter()
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL") // UPCOMING, PAST
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState<Event | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    // Filter Logic
    const filteredEvents = events.filter(event => {
        const matchesSearch =
            event.title.toLowerCase().includes(search.toLowerCase()) ||
            event.location.toLowerCase().includes(search.toLowerCase())

        const now = new Date()
        const eventDate = new Date(event.date)
        const isPast = eventDate < now

        const matchesStatus =
            statusFilter === "ALL" ||
            (statusFilter === "UPCOMING" && !isPast) ||
            (statusFilter === "PAST" && isPast)

        return matchesSearch && matchesStatus
    })

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)
    const paginatedEvents = filteredEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    // Stats Logic
    const statsData = (() => {
        const now = new Date()
        const total = events.length
        const upcoming = events.filter(e => new Date(e.date) >= now).length
        const past = events.filter(e => new Date(e.date) < now).length
        const thisMonth = events.filter(e => {
            const d = new Date(e.date)
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        }).length

        return { total, upcoming, past, thisMonth }
    })()

    // Handlers
    const handleSubmit = async (formData: FormData) => {
        setIsUploading(true)
        try {
            const file = formData.get("file") as File
            let coverImage = editingEvent?.coverImage || ""

            if (file && file.size > 0) {
                const uploadRes = await uploadEventImage(formData)
                if (uploadRes.success && uploadRes.imageUrl) {
                    coverImage = uploadRes.imageUrl
                }
            }

            const eventData = {
                title: formData.get("title") as string,
                location: formData.get("location") as string,
                date: new Date(formData.get("date") as string),
                coverImage: coverImage
            }

            if (editingEvent) {
                await updateEvent(editingEvent.id, eventData)
            } else {
                const createData = new FormData()
                Object.entries(eventData).forEach(([key, val]) => createData.append(key, val.toString()))
                if (coverImage) createData.set('coverImage', coverImage) // Ensure image is set correctly if string

                // Fix: createEvent expects FormData in my implementation or object? 
                // Currently existing implementation in AdminTabs uses FormData for create and Object for update. 
                // Let's standardise on FormData for Create as per existing code.
                const newFormData = new FormData();
                newFormData.append("title", eventData.title);
                newFormData.append("location", eventData.location);
                newFormData.append("date", eventData.date.toISOString());
                newFormData.append("coverImage", coverImage);

                await createEvent(newFormData)
            }

            setIsFormOpen(false)
            setEditingEvent(null)
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("İşlem başarısız")
        } finally {
            setIsUploading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("Bu etkinliği silmek istediğinize emin misiniz?")) {
            await deleteEvent(id)
            router.refresh()
        }
    }

    return (
        <div className="space-y-8 font-sans">
            {/* Top Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Toplam Etkinlik", value: statsData.total, icon: Calendar, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "Yaklaşan", value: statsData.upcoming, icon: Clock, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Tamamlanan", value: statsData.past, icon: CheckCircle2, color: "text-gray-600", bg: "bg-gray-50" },
                    { label: "Bu Ay", value: statsData.thisMonth, icon: Filter, color: "text-blue-600", bg: "bg-blue-50" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100/50 shadow-[0_2px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-1">
                                <AnimatedCounter value={stat.value} />
                            </h3>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls Bar */}
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                <div className="flex flex-col md:flex-row gap-4 items-center flex-1">
                    <div className="relative flex-1 w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Etkinlik ara..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary/20 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400 h-[50px]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <FilterDropdown
                        label="Durum"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={[
                            { value: "ALL", label: "Tümü" },
                            { value: "UPCOMING", label: "Yaklaşan" },
                            { value: "PAST", label: "Geçmiş" },
                        ]}
                    />
                </div>
                <button
                    onClick={() => { setIsFormOpen(true); setEditingEvent(null) }}
                    className="px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold transition-all shadow-lg shadow-gray-200 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Yeni Etkinlik
                </button>
            </div>

            {/* Form Modal */}
            {(isFormOpen || editingEvent) && (
                <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white rounded-[2rem] w-full max-w-lg p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => { setIsFormOpen(false); setEditingEvent(null) }} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                            <XCircle className="w-5 h-5 text-gray-500" />
                        </button>
                        <h3 className="text-xl font-bold mb-6">{editingEvent ? 'Etkinliği Düzenle' : 'Yeni Etkinlik Oluştur'}</h3>
                        <form action={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-1">Etkinlik Başlığı</label>
                                <input name="title" defaultValue={editingEvent?.title} required className="w-full p-3 bg-gray-50 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Örn: Doğa Yürüyüşü" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-1">Tarih</label>
                                    <input type="datetime-local" name="date" defaultValue={editingEvent?.date ? new Date(editingEvent.date).toISOString().slice(0, 16) : ''} required className="w-full p-3 bg-gray-50 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/20" />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-1">Konum</label>
                                    <input name="location" defaultValue={editingEvent?.location} required className="w-full p-3 bg-gray-50 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Örn: İstanbul" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-1">Kapak Görseli</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors">
                                    <input type="file" name="file" accept="image/*" className="hidden" id="event-file" />
                                    <label htmlFor="event-file" className="cursor-pointer block">
                                        <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                        <span className="text-sm text-gray-500 block">Görsel Yüklemek İçin Tıklayın</span>
                                    </label>
                                    {editingEvent?.coverImage && <p className="text-xs text-green-600 mt-2 truncate">Mevcut: {editingEvent.coverImage.split('/').pop()}</p>}
                                </div>
                            </div>
                            <button disabled={isUploading} className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all mt-4 disabled:opacity-50">
                                {isUploading ? 'İşleniyor...' : (editingEvent ? 'Güncelle' : 'Oluştur')}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* List View */}
            <div className="space-y-4">
                {paginatedEvents.length > 0 ? (
                    paginatedEvents.map((event) => (
                        <div key={event.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:border-gray-200 transition-all duration-300 group flex flex-col md:flex-row gap-6">
                            {/* Image */}
                            <div className="w-full md:w-48 h-48 md:h-32 rounded-2xl bg-gray-100 overflow-hidden shrink-0 relative">
                                {event.coverImage ? (
                                    <img src={event.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-300"><Calendar className="w-8 h-8" /></div>
                                )}
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-gray-700 shadow-sm">
                                    {new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                                </div>
                            </div>

                            <div className="flex-1 min-w-0 py-2 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" /> {event.location}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-gray-400" /> {new Date(event.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    <button onClick={() => setEditingEvent(event)} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-sm font-bold transition-colors flex items-center gap-2">
                                        <Edit2 className="w-4 h-4" /> Düzenle
                                    </button>
                                    <button onClick={() => handleDelete(event.id)} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-bold transition-colors flex items-center gap-2">
                                        <Trash2 className="w-4 h-4" /> Sil
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-2xl border border-gray-100">
                            📅
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Etkinlik Bulunamadı</h3>
                        <p className="text-gray-500">Arama kriterlerinize uygun etkinlik yok veya henüz eklenmemiş.</p>
                    </div>
                )}
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center pt-8">
                        <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === i + 1 ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
