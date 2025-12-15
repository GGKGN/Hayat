"use client"

import { useState } from "react"
import WishCard, { Wish } from "./WishCard"
import Modal from "./Modal"
import { Calendar, User, Clock, CheckCircle2, Sparkles, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"

export default function WishBoard({ initialWishes }: { initialWishes: any[] }) {
    const [filter, setFilter] = useState<"ALL" | "PENDING" | "IN_PROCESS" | "COMPLETED">("ALL")
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 6
    const [selectedWish, setSelectedWish] = useState<Wish | null>(null)

    // Cast initial wishes to typed array
    const wishes = initialWishes as Wish[]

    const filteredWishes = wishes.filter(w => filter === "ALL" || w.status === filter)

    // Calculate pagination
    const totalPages = Math.ceil(filteredWishes.length / ITEMS_PER_PAGE)
    const paginatedWishes = filteredWishes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    const handleFilterChange = (status: "ALL" | "PENDING" | "IN_PROCESS" | "COMPLETED") => {
        setFilter(status)
        setCurrentPage(1) // Reset to first page on filter change
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
            case 'IN_PROCESS': return 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse';
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse';
        }
    }

    return (
        <div id="wishes" className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <span className="text-secondary font-bold tracking-wider text-sm uppercase mb-2 block">Hayallerimiz</span>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tight leading-tight">
                        Dilek Panosu
                    </h2>
                    <p className="mt-4 text-lg text-gray-500 max-w-lg leading-relaxed">
                        Senin hayalin, bizim gerçeğimiz olsun. Bir dilek tut, gerçekleşsin!
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shadow-sm inline-flex">
                    {(["ALL", "PENDING", "IN_PROCESS", "COMPLETED"] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => handleFilterChange(status)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${filter === status
                                ? "bg-white text-secondary shadow-md ring-1 ring-black/5"
                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                        >
                            {status === "ALL" ? "Tümü" :
                                status === "PENDING" ? "Bekleyen" :
                                    status === "IN_PROCESS" ? "Süreçte" : "Tamamlanan"}
                        </button>
                    ))}
                </div>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${paginatedWishes.length === 0 ? 'min-h-[400px]' : ''}`}>
                {paginatedWishes.length > 0 ? (
                    paginatedWishes.map(wish => (
                        <WishCard
                            key={wish.id}
                            wish={wish}
                            onClick={() => setSelectedWish(wish)}
                        />
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-3xl">
                            ✨
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Henüz Dilek Yok</h3>
                        <p className="text-gray-500 max-w-md">Bu kategoride gösterilecek dilek bulunmuyor. İlk dileği sen tut!</p>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 space-x-4">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-md disabled:opacity-30 disabled:hover:shadow-none disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="flex space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-full font-bold transition-all ${currentPage === page
                                    ? "bg-secondary text-secondary-foreground shadow-lg scale-110"
                                    : "text-gray-500 hover:bg-gray-100"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-md disabled:opacity-30 disabled:hover:shadow-none disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            )}

            <Modal
                isOpen={!!selectedWish}
                onClose={() => setSelectedWish(null)}
                title={selectedWish?.title}
            >
                {selectedWish && (
                    <div className="space-y-8">
                        {/* Image (if exists) */}
                        {selectedWish.imageUrl && (
                            <div className="rounded-2xl overflow-hidden shadow-md">
                                <img src={selectedWish.imageUrl} alt={selectedWish.title} className="w-full h-auto object-cover max-h-80" />
                            </div>
                        )}

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Status */}
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Durum</span>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${getStatusColor(selectedWish.status)}`}>
                                    {selectedWish.status === 'COMPLETED' ? "Gerçekleşti" : selectedWish.status === 'IN_PROCESS' ? "Hazırlanıyor" : "Bekliyor"}
                                </span>
                            </div>

                            {/* Estimated Date */}
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Tarih</span>
                                <div className="flex items-center text-gray-800 font-bold">
                                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                    {selectedWish.estimatedDate
                                        ? new Date(selectedWish.estimatedDate).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
                                        : new Date(selectedWish.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
                                    }
                                </div>
                            </div>

                            {/* Child Info (If visible) */}
                            {(selectedWish.childName || selectedWish.childAge) && (
                                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">Çocuk</span>
                                    <div className="flex items-center text-blue-900 font-bold">
                                        <User className="w-4 h-4 mr-2" />
                                        <span>{selectedWish.childName || "İsimsiz"}</span>
                                        {selectedWish.childAge && <span className="ml-2 bg-white px-2 py-0.5 rounded text-xs text-blue-600">{selectedWish.childAge} Yaş</span>}
                                    </div>
                                </div>
                            )}

                            {/* Volunteer Info (If assigned) */}
                            {selectedWish.volunteer && (
                                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-1">Gönüllü</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center overflow-hidden ring-2 ring-white">
                                            {selectedWish.volunteer.image ? (
                                                <img src={selectedWish.volunteer.image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-3 h-3 text-purple-300" />
                                            )}
                                        </div>
                                        <span className="text-purple-900 font-bold text-sm">{selectedWish.volunteer.name}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Detaylar</span>
                            <div className="prose prose-stone max-w-none bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                                    {selectedWish.description}
                                </p>
                            </div>
                        </div>

                        {/* User Info & Link */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4 ring-2 ring-white shadow-sm overflow-hidden">
                                    <div className="bg-gradient-to-br from-indigo-500 to-purple-500 w-full h-full flex items-center justify-center text-white text-lg font-bold">
                                        {selectedWish.childName ? selectedWish.childName.charAt(0) : <User className="w-6 h-6" />}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{selectedWish.childName || selectedWish.user?.name || "Anonim"}</p>
                                    <p className="text-xs text-gray-500 font-medium">Dilek Sahibi</p>
                                </div>
                            </div>

                            {selectedWish.url && (
                                <a
                                    href={selectedWish.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-green-600 transition-all shadow-md hover:shadow-lg group hover:-translate-y-0.5"
                                >
                                    <ExternalLink className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                    Bağlantıya Git
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
