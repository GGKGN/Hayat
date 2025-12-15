import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-20 pb-10 rounded-t-[3rem]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block">
                            <img src="/images/logo-2.png" alt="Hayat Logo" className="h-24 w-auto brightness-0 invert" />
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Hayalleri Yaşatma Topluluğu olarak, bir çocuğun gülümsemesinin dünyayı değiştirebileceğine inanıyoruz.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://instagram.com/rteuhayat" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Hızlı Erişim</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link href="/about" className="hover:text-primary transition-colors">Hakkımızda</Link></li>
                            <li><Link href="/projects" className="hover:text-primary transition-colors">Projeler</Link></li>
                            <li><Link href="/events" className="hover:text-primary transition-colors">Etkinlikler</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">İletişim</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Destek</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><Link href="/volunteer" className="hover:text-primary transition-colors">Gönüllü Ol</Link></li>
                            <li><Link href="/support" className="hover:text-primary transition-colors">Bağış Yap</Link></li>
                            <li><Link href="/faq" className="hover:text-primary transition-colors">S.S.S</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Gizlilik Politikası</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">İletişim</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start">
                                <MapPin className="w-5 h-5 mr-3 text-primary shrink-0" />
                                <span>Recep Tayyip Erdoğan Üniversitesi, Rize</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="w-5 h-5 mr-3 text-primary shrink-0" />
                                <span>+90 (464) 223 61 26</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="w-5 h-5 mr-3 text-primary shrink-0" />
                                <span>iletisim@hayat.org.tr</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Hayalleri Yaşatma Topluluğu. Tüm hakları saklıdır.</p>
                </div>
            </div>
        </footer>
    )
}
