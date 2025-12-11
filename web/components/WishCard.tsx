import { Wish as PrismaWish } from "@prisma/client"
import { Calendar, User, Clock, CheckCircle2, Sparkles, Link2 } from "lucide-react"

type Wish = PrismaWish & {
    user: {
        name: string | null
        image: string | null
    } | null
    url: string | null
}

export type { Wish }

export default function WishCard({ wish, onClick }: { wish: Wish; onClick?: () => void }) {
    const getStatusColor = () => {
        switch (wish.status) {
            case 'COMPLETED': return 'bg-green-500 text-white';
            case 'IN_PROCESS': return 'bg-blue-500 text-white';
            default: return 'bg-yellow-400 text-yellow-900';
        }
    }

    const getHeaderGradient = () => {
        switch (wish.status) {
            case 'COMPLETED': return 'from-green-400 to-green-600';
            case 'IN_PROCESS': return 'from-blue-400 to-blue-600';
            default: return 'from-yellow-300 to-yellow-500';
        }
    }

    return (
        <div
            onClick={onClick}
            className={`group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex flex-col h-full border border-gray-100 transform hover:-translate-y-2 ${onClick ? 'cursor-pointer' : ''}`}
        >
            {/* Colored Header (Mimics Image Area) */}
            <div className={`h-32 relative bg-gradient-to-br ${getHeaderGradient()} p-6 flex items-start justify-between overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full blur-xl -ml-10 -mb-10"></div>

                <div className="relative z-10">
                    <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl text-white inline-flex border border-white/20">
                        {wish.status === 'COMPLETED' ? <CheckCircle2 className="w-6 h-6" /> :
                            wish.status === 'IN_PROCESS' ? <Clock className="w-6 h-6 animate-pulse" /> :
                                <Sparkles className="w-6 h-6" />}
                    </div>
                </div>

                <div className={`relative z-10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-white/20 backdrop-blur-md ${wish.status === 'PENDING' ? 'bg-white/90 text-yellow-700 animate-pulse' :
                    wish.status === 'IN_PROCESS' ? 'bg-white/20 text-white animate-pulse' :
                        'bg-white/20 text-white'
                    }`}>
                    {wish.status === 'COMPLETED' ? 'Gerçekleşti' : wish.status === 'IN_PROCESS' ? 'Hazırlanıyor' : 'Bekliyor'}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1 -mt-6">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-1 flex flex-col">
                    <h3 className="text-xl font-black text-gray-800 mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                        {wish.title}
                    </h3>

                    {wish.description && (
                        <p className="text-gray-500 text-sm line-clamp-3 mb-4 leading-relaxed flex-1">
                            {wish.description}
                        </p>
                    )}
                </div>

                <div className="mt-4 flex items-center justify-between text-gray-400 text-xs font-bold uppercase tracking-wider">
                    <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-2 ring-2 ring-white">
                            <User className="w-3 h-3 text-gray-400" />
                        </div>
                        <span className="truncate max-w-[100px]">{wish.user?.name || "Anonim"}</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1.5" />
                        <span>{new Date(wish.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'numeric', year: 'numeric' })}</span>
                    </div>
                </div>

                {wish.url && (
                    <div className="absolute top-4 right-4 z-20">
                        <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-full text-white border border-white/20 shadow-sm" title="Link Mevcut">
                            <Link2 className="w-4 h-4" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
