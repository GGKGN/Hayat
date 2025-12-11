"use client"

import { useState } from "react"
import {
    Users,
    FileText,
    CheckCircle,
    XCircle,
    Plus,
    Trash2,
    ToggleLeft,
    ToggleRight,
    ChevronDown,
    ChevronUp
} from "lucide-react"
import {
    createQuestion,
    deleteQuestion,
    updateQuestionStatus,
    toggleVolunteerSystem,
    updateApplicationStatus,
    deleteApplication
} from "@/actions/admin-volunteer"
import { useRouter } from "next/navigation"

export default function VolunteerTab({ questions, applications, isOpen }: { questions: any[], applications: any[], isOpen: boolean }) {
    const [subTab, setSubTab] = useState<"APPLICATIONS" | "QUESTIONS">("APPLICATIONS")
    const router = useRouter()

    // Question Form State
    const [newQuestion, setNewQuestion] = useState("")

    // Toggle logic
    async function handleToggleSystem() {
        await toggleVolunteerSystem(!isOpen)
        router.refresh()
    }

    async function handleAddQuestion() {
        if (!newQuestion.trim()) return
        await createQuestion(newQuestion)
        setNewQuestion("")
    }

    async function handleApprove(id: string) {
        if (confirm("Bu başvuruyu onaylamak istediğinize emin misiniz? Kullanıcı Üye (MEMBER) yetkisine yükseltilecek.")) {
            await updateApplicationStatus(id, "APPROVED")
        }
    }

    async function handleReject(id: string) {
        if (confirm("Bu başvuruyu reddetmek istediğinize emin misiniz?")) {
            await updateApplicationStatus(id, "REJECTED")
        }
    }

    async function handleDelete(id: string) {
        if (confirm("Bu başvuruyu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
            await deleteApplication(id)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header / Toggle */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Gönüllü Başvuru Sistemi</h3>
                    <p className="text-gray-500 text-sm">Başvuruları açıp kapatabilir, soruları düzenleyebilirsiniz.</p>
                </div>
                <button
                    onClick={handleToggleSystem}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                >
                    {isOpen ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    {isOpen ? 'Sistem Açık' : 'Sistem Kapalı'}
                </button>
            </div>

            {/* Sub Tabs */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setSubTab("APPLICATIONS")}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${subTab === "APPLICATIONS" ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Başvurular ({applications.filter(a => a.status === 'PENDING').length})
                </button>
                <button
                    onClick={() => setSubTab("QUESTIONS")}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${subTab === "QUESTIONS" ? 'bg-white shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Soru Yönetimi
                </button>
            </div>

            {subTab === "QUESTIONS" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    {/* Add Question */}
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100">
                        <h4 className="font-bold mb-4">Yeni Soru Ekle</h4>
                        <div className="flex gap-4">
                            <input
                                value={newQuestion}
                                onChange={(e) => setNewQuestion(e.target.value)}
                                placeholder="Örn: Neden bizimle çalışmak istiyorsunuz?"
                                className="flex-1 p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20"
                            />
                            <button onClick={handleAddQuestion} className="bg-primary text-white p-3 rounded-xl hover:bg-primary/90 transition-colors">
                                <Plus className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Question List */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden">
                        {questions.map((q, idx) => (
                            <div key={q.id} className="p-6 border-b border-gray-50 last:border-0 flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-sm">
                                        {idx + 1}
                                    </span>
                                    <p className="font-medium text-gray-800">{q.text}</p>
                                    {!q.isActive && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">Pasif</span>}
                                </div>
                                <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => updateQuestionStatus(q.id, !q.isActive)}
                                        className={`p-2 rounded-lg transition-colors ${q.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}
                                        title={q.isActive ? "Pasif Yap" : "Aktif Yap"}
                                    >
                                        {q.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => deleteQuestion(q.id)}
                                        className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {questions.length === 0 && (
                            <div className="p-8 text-center text-gray-500">Henüz soru eklenmemiş.</div>
                        )}
                    </div>
                </div>
            )}

            {subTab === "APPLICATIONS" && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    {applications.length === 0 ? (
                        <div className="bg-white p-12 text-center rounded-[2rem] border border-gray-100">
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Henüz başvuru yok.</p>
                        </div>
                    ) : (
                        applications.map(app => (
                            <ApplicationCard
                                key={app.id}
                                app={app}
                                onApprove={() => handleApprove(app.id)}
                                onReject={() => handleReject(app.id)}
                                onDelete={() => handleDelete(app.id)}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

function ApplicationCard({ app, onApprove, onReject, onDelete }: any) {
    const [isExpanded, setIsExpanded] = useState(false)
    const answers = typeof app.answers === 'string' ? JSON.parse(app.answers) : app.answers

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all hover:shadow-md">
            <div className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shrink-0">
                        {app.user.image ? (
                            <img src={app.user.image} className="w-full h-full object-cover" />
                        ) : (
                            <Users className="w-6 h-6 m-auto mt-3 text-gray-400" />
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800">{app.user.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{app.user.email}</span>
                            <span>•</span>
                            <span className="text-primary font-bold">{app.team.name}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold 
                        ${app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                            app.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`
                    }>
                        {app.status === 'PENDING' ? 'Bekliyor' : app.status === 'APPROVED' ? 'Onaylandı' : 'Reddedildi'}
                    </span>

                    {app.status === 'PENDING' && (
                        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                            <button onClick={onApprove} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 hover:scale-105 transition-all">
                                <CheckCircle className="w-5 h-5" />
                            </button>
                            <button onClick={onReject} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 hover:scale-105 transition-all">
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {isExpanded ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}

                    <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors ml-2" title="Başvuruyu Sil">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="border-t border-gray-50 bg-gray-50/50 p-6 space-y-4">
                    <h5 className="font-bold text-sm text-gray-700 uppercase tracking-wider">Başvuru Yanıtları</h5>
                    {answers?.map((ans: any, i: number) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-gray-100">
                            <p className="text-sm font-bold text-gray-800 mb-2">{ans.question}</p>
                            <p className="text-gray-600 text-sm whitespace-pre-wrap">{ans.answer}</p>
                        </div>
                    ))}
                    <div className="text-xs text-gray-400 text-right">
                        Başvuru Tarihi: {new Date(app.createdAt).toLocaleDateString("tr-TR")}
                    </div>
                </div>
            )}
        </div>
    )
}
