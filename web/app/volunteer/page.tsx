import { ArrowRight, Heart, Users, Star } from "lucide-react"
import Link from "next/link"
import { auth } from "@/lib/auth"

export default async function VolunteerPage() {
    const session = await auth()

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 pt-28 pb-12 px-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Hero */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl mb-6 shadow-xl shadow-green-100 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                        <Users className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                        Gönüllümüz <span className="text-primary">Olun</span>
                    </h1>
                    <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
                        Küçük bir dokunuşla büyük değişimler yaratabilirsin. Hayalleri yaşatmak için bize katıl.
                    </p>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/50 shadow-xl shadow-green-900/5 hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6 text-red-500">
                            <Heart className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-black text-gray-800 mb-3">İyilik Yap</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            İHTİYAÇ SAHİBİ ÇOCUKLARA UMUT OL, ONLARIN YÜZÜNDEKİ GÜLÜMSEMEYE ORTAK OL.
                        </p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/50 shadow-xl shadow-green-900/5 hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
                            <Users className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-black text-gray-800 mb-3">Sosyalleş</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            SENİN GİBİ DÜŞÜNEN YÜZLERCE GÖNÜLLÜ İLE TANIŞ, YENİ ARKADAŞLIKLAR KUR.
                        </p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/50 shadow-xl shadow-green-900/5 hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center mb-6 text-yellow-500">
                            <Star className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-black text-gray-800 mb-3">Geliş</h3>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            KİŞİSEL GELİŞİMİNE KATKI SAĞLAYACAK ETKİNLİKLER VE EĞİTİMLERLE KENDİNİ GELİŞTİR.
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-gray-900 text-white p-10 md:p-16 rounded-[3rem] text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32 transition-all duration-700 group-hover:bg-primary/30" />

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-black mb-6">Hemen Başvur</h2>
                        <p className="text-gray-400 font-medium text-lg mb-10 max-w-xl mx-auto">
                            Aramıza katılmak için formu doldur, en kısa sürede seninle iletişime geçelim.
                        </p>
                        <Link href={session?.user ? "/volunteer/apply" : "/register"} className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-2xl font-black text-lg hover:bg-primary hover:text-white transition-all shadow-lg hover:shadow-primary/50 hover:-translate-y-1">
                            {session?.user ? 'Başvuru Yap' : 'Kayıt Ol ve Başvur'}
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
