"use client"

import { useState } from "react"
import { Upload, FileText, Tag, Plus, Trash2, X, Download, Search, Settings } from "lucide-react"
import { uploadReport, createTag, deleteTag, deleteReport } from "@/actions/reports"
import { useRouter } from "next/navigation"

interface ReportsViewProps {
    tags: any[]
    reports: any[]
    user: any
}

export default function ReportsView({ tags: initialTags, reports: initialReports, user }: ReportsViewProps) {
    const [reports, setReports] = useState(initialReports)
    const [tags, setTags] = useState(initialTags)
    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [selectedTagFitler, setSelectedTagFilter] = useState<string | null>(null)
    const [isAdminMode, setIsAdminMode] = useState(false)

    // Upload Form State
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [isUploading, setIsUploading] = useState(false)

    const router = useRouter()

    const isAdmin = user.role === "ADMIN"

    // Handlers
    async function handleUpload(formData: FormData) {
        setIsUploading(true)
        // Append selected tags
        formData.append("tags", JSON.stringify(selectedTags))

        try {
            await uploadReport(formData, user.id)
            setIsUploadOpen(false)
            setSelectedTags([])
            router.refresh()
            // Optimistic update omitted for simplicity, relying on router.refresh
        } catch (e) {
            alert("Rapor yüklenirken hata oluştu.")
        } finally {
            setIsUploading(false)
        }
    }

    async function handleAddTag(formData: FormData) {
        const name = formData.get("name") as string
        if (!name) return
        await createTag(name)
        router.refresh()
        // Reset form manually or use ref
        const form = document.getElementById("add-tag-form") as HTMLFormElement
        form?.reset()
    }

    async function handleDeleteTag(id: string) {
        if (!confirm("Bu etiketi silmek istediğinize emin misiniz?")) return
        await deleteTag(id)
        router.refresh()
    }

    async function handleDeleteReport(id: string) {
        if (!confirm("Bu raporu silmek istediğinize emin misiniz?")) return
        await deleteReport(id)
        router.refresh()
    }

    const toggleTagSelection = (tagId: string) => {
        setSelectedTags(prev =>
            prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
        )
    }

    // Filter Logic
    const filteredReports = reports.filter(r => {
        const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
            r.uploadedBy.name?.toLowerCase().includes(search.toLowerCase())
        const matchesTag = selectedTagFitler ? r.tags.some((t: any) => t.name === selectedTagFitler) : true
        return matchesSearch && matchesTag
    })

    return (
        <div className="space-y-8">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none md:w-64">
                        <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rapor ara..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Tag Filter */}
                    <select
                        className="bg-gray-50 border-none rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary/20 text-sm font-bold text-gray-600 cursor-pointer"
                        onChange={(e) => setSelectedTagFilter(e.target.value || null)}
                    >
                        <option value="">Tüm Etiketler</option>
                        {tags.map(t => (
                            <option key={t.id} value={t.name}>{t.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {isAdmin && (
                        <button
                            onClick={() => setIsAdminMode(!isAdminMode)}
                            className={`p-3 rounded-xl transition-all ${isAdminMode ? 'bg-purple-100 text-purple-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                            title="Etiket Yönetimi"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                    )}
                    <button
                        onClick={() => setIsUploadOpen(true)}
                        className="flex-1 md:flex-none bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <Upload className="w-5 h-5" />
                        Rapor Yükle
                    </button>
                </div>
            </div>

            {/* Admin Tag Management Panel */}
            {isAdminMode && isAdmin && (
                <div className="bg-purple-50 border border-purple-100 rounded-[2rem] p-8 animate-in slide-in-from-top-4">
                    <h3 className="text-lg font-black text-purple-900 mb-6 flex items-center gap-2">
                        <Tag className="w-5 h-5" /> Etiket Yönetimi
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-sm font-bold text-purple-700 mb-3">Yeni Etiket Ekle</h4>
                            <form id="add-tag-form" action={handleAddTag} className="flex gap-2">
                                <input
                                    name="name"
                                    placeholder="Etiket adı..."
                                    className="flex-1 p-3 rounded-xl border-none focus:ring-2 focus:ring-purple-300 shadow-sm"
                                    required
                                />
                                <button className="bg-purple-600 text-white p-3 rounded-xl hover:bg-purple-700 transition-colors shadow-purple-200 shadow-lg">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </form>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-purple-700 mb-3">Mevcut Etiketler</h4>
                            <div className="flex flex-wrap gap-2">
                                {tags.map(t => (
                                    <div key={t.id} className="bg-white px-3 py-1.5 rounded-lg text-sm font-bold text-gray-600 shadow-sm flex items-center gap-2 border border-purple-100">
                                        {t.name}
                                        <button onClick={() => handleDeleteTag(t.id)} className="text-red-300 hover:text-red-500 transition-colors">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Modal */}
            {isUploadOpen && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Rapor Yükle</h2>
                                <p className="text-gray-500 font-medium text-sm mt-1">Takımınızla paylaşmak istediğiniz dosyayı yükleyin.</p>
                            </div>
                            <button onClick={() => setIsUploadOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <form action={handleUpload} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Rapor Başlığı</label>
                                <input
                                    name="title"
                                    required
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 font-bold text-gray-800"
                                    placeholder="Örn: Aylık Faaliyet Raporu"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Açıklama (Opsiyonel)</label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 font-medium resize-none"
                                    placeholder="Rapor hakkında kısa bilgi..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Dosya Seç</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-all group cursor-pointer relative">
                                    <input
                                        type="file"
                                        name="file"
                                        required
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <p className="font-bold text-gray-600">Dosyayı buraya sürükleyin veya seçin</p>
                                    <p className="text-xs text-gray-400 mt-2">PDF, Word, Excel (Max 10MB)</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-700 ml-1">Etiketler</label>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map(t => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => toggleTagSelection(t.id)}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${selectedTags.includes(t.id)
                                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30'
                                                : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'
                                                }`}
                                        >
                                            {t.name}
                                        </button>
                                    ))}
                                    {tags.length === 0 && (
                                        <p className="text-sm text-gray-400 italic">Henüz tanımlı etiket yok.</p>
                                    )}
                                </div>
                            </div>

                            <button
                                disabled={isUploading}
                                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none mt-4"
                            >
                                {isUploading ? 'Yükleniyor...' : 'Raporu Yükle'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredReports.map((report: any) => (
                    <div key={report.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <FileText className="w-6 h-6" />
                            </div>
                            {user.id === report.uploadedByUserId || isAdmin ? (
                                <button
                                    onClick={() => handleDeleteReport(report.id)}
                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            ) : null}
                        </div>

                        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1" title={report.title}>{report.title}</h3>

                        {report.description && (
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{report.description}</p>
                        )}

                        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                            {report.tags.map((t: any) => (
                                <span key={t.id} className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                                    #{t.name}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                                    {report.uploadedBy.image ? (
                                        <img src={report.uploadedBy.image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-500">
                                            {report.uploadedBy.name?.[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-700">{report.uploadedBy.name}</span>
                                    <span className="text-[10px] text-gray-400">{new Date(report.uploadedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'numeric', year: 'numeric' })}</span>
                                </div>
                            </div>

                            <a
                                href={report.filePath}
                                download
                                className="p-2 bg-gray-50 hover:bg-primary hover:text-white rounded-xl transition-colors text-gray-400"
                                title="İndir"
                            >
                                <Download className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                ))}

                {filteredReports.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                            <FileText className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Rapor Bulunamadı</h3>
                        <p className="text-gray-500">Aradığınız kriterlere uygun rapor yok veya henüz hiç rapor yüklenmemiş.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
