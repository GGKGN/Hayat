import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
    return (
        <div className="relative overflow-hidden bg-[#FEF9E7] min-h-[90vh] flex items-center">
            {/* Playful Background Blobs */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-yellow-200/60 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-70"></div>
            <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-purple-200/60 rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed opacity-70"></div>
            <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-pink-200/60 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow opacity-70"></div>

            {/* Floating Elements (Decorative) */}
            <div className="absolute top-20 left-20 hidden lg:block animate-float">
                <span className="text-6xl">🎈</span>
            </div>
            <div className="absolute bottom-40 right-10 hidden lg:block animate-float-delayed">
                <span className="text-6xl">✨</span>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 text-primary mb-8 shadow-sm">
                        <Sparkles className="w-5 h-5 mr-2 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold tracking-wide text-sm uppercase">Hayalleri Gerçeğe Dönüştürüyoruz</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-gray-800 tracking-tight leading-[1.1] mb-8 drop-shadow-sm">
                        <span className="text-primary inline-block transform hover:scale-105 transition-transform duration-300 cursor-default">Hayal Et</span> <br className="hidden md:block" />
                        <span className="text-accent inline-block transform hover:scale-105 transition-transform duration-300 cursor-default delay-75">Harekete Geç!</span>
                    </h1>

                    <p className="mt-6 text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium whitespace-pre-line">
                        Rize'nin en renkli topluluğunda senin de bir yerin var. İyilik yapmak hiç bu kadar eğlenceli olmamıştı.
                    </p>

                    <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="#wishes" className="group relative px-8 py-4 bg-primary text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl hover:bg-green-400 transition-all duration-300 transform hover:-translate-y-1">
                            Dilek Tut
                            <span className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs animate-bounce">⭐</span>
                        </Link>
                        <Link href="/about" className="px-8 py-4 bg-white text-gray-700 text-lg font-bold rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-blue-100 flex items-center">
                            Bizi Tanı <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
