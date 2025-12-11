"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react"
import { useState, useEffect } from "react"


interface NavbarProps {
    links?: { name: string; path: string }[]
}

export default function Navbar({ links }: NavbarProps) {
    const { data: session } = useSession()
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    // Default links if none provided
    const defaultLinks = [
        { name: "Ana Sayfa", path: "/" },
        { name: "Takımlar", path: "/teams" },
        { name: "Etkinlikler", path: "/events" },
        { name: "Projeler", path: "/projects" },
        { name: "Destek Ol", path: "/support" }, // Added
        // Condition for Reports will be handled by filtering or appending
        { name: "Hakkımızda", path: "/about" },
        { name: "İletişim", path: "/contact" }
    ]

    const navLinks = links || defaultLinks

    // Inject Reports link if user is team member
    const displayLinks = [...navLinks]
    // Check if "Raporlar" is already there (e.g. from props)
    const hasReports = displayLinks.some(l => l.path === "/reports")
    const hasCalendar = displayLinks.some(l => l.path === "/calendar")

    if (session?.user) {
        // Add Calendar if not present AND user is NOT just a "USER" (must be MEMBER or ADMIN)
        if (!hasCalendar && (session.user.role === "ADMIN" || session.user.role === "MEMBER")) {
            const eventsIndex = displayLinks.findIndex(l => l.path === "/events")
            if (eventsIndex !== -1) {
                displayLinks.splice(eventsIndex + 1, 0, { name: "Ziyaret Takvimi", path: "/calendar" })
            } else {
                displayLinks.push({ name: "Ziyaret Takvimi", path: "/calendar" })
            }
        }

        // Add Reports if User is ADMIN or MEMBER (Exclude basic USER)
        if ((session.user.role === "ADMIN" || session.user.role === "MEMBER") && !hasReports) {
            const projectIndex = displayLinks.findIndex(l => l.path === "/projects")
            if (projectIndex !== -1) {
                displayLinks.splice(projectIndex + 1, 0, { name: "Raporlar", path: "/reports" })
            } else {
                displayLinks.splice(displayLinks.length - 2, 0, { name: "Raporlar", path: "/reports" })
            }
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Profile Dropdown State
    const [isProfileOpen, setIsProfileOpen] = useState(false)

    // Close handlers
    const closeMenu = () => setIsOpen(false)
    const closeProfile = () => setIsProfileOpen(false)

    // Helper to toggle profile
    const toggleProfile = () => setIsProfileOpen(!isProfileOpen)

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-6"}`}>
            {/* Click Outside Handler for Profile Dropdown */}
            {isProfileOpen && (
                <div
                    className="fixed inset-0 z-[40] cursor-default"
                    onClick={closeProfile}
                    aria-hidden="true"
                />
            )}

            <div className={`mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${scrolled
                ? "bg-white/80 backdrop-blur-lg shadow-lg rounded-full w-[calc(100%-2rem)] md:w-fit border border-white/50"
                : "bg-transparent max-w-7xl w-full"
                }`}>
                <div className="flex justify-between md:justify-center md:gap-8 h-24 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" onClick={closeMenu} className="flex items-center group">
                            <img src="/images/logo-1.png" alt="Hayat" className="h-20 w-auto group-hover:scale-105 transition-transform duration-300" />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-1 items-center">
                        {displayLinks.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className="text-gray-600 hover:text-primary hover:bg-green-50 px-3 py-2 rounded-full transition-all font-bold text-sm whitespace-nowrap"
                            >
                                {item.name}
                            </Link>
                        ))}

                        <div className="pl-2 border-l border-gray-200 ml-1">
                            {session ? (
                                <div className="relative z-[50]">
                                    <button
                                        onClick={toggleProfile}
                                        className={`flex items-center space-x-2 text-gray-700 font-bold focus:outline-none bg-white p-1 pr-4 rounded-full border shadow-sm hover:shadow-md transition-all ${isProfileOpen ? 'border-primary ring-2 ring-primary/20' : 'border-gray-100'}`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/30">
                                            {session.user.image ? (
                                                <img src={session.user.image} alt={session.user.name || "User"} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <span className="text-sm font-bold text-secondary">{session.user.name?.charAt(0) || "U"}</span>
                                            )}
                                        </div>
                                        <span className="hidden lg:block text-sm">{session.user.name}</span>
                                    </button>

                                    {/* Dropdown */}
                                    <div className={`absolute right-0 w-56 mt-4 origin-top-right bg-white border border-gray-100 rounded-2xl shadow-xl transition-all duration-300 transform p-2 ${isProfileOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                                        <div className="space-y-1">
                                            <Link href="/profile" onClick={closeProfile} className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 rounded-xl transition-colors">
                                                <UserIcon className="w-4 h-4 mr-3 text-primary" /> Profilim
                                            </Link>
                                            {(session.user.role === "ADMIN" || session.user.role === "MEMBER") && (
                                                <Link href="/admin" onClick={closeProfile} className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 rounded-xl transition-colors">
                                                    <LayoutDashboard className="w-4 h-4 mr-3 text-purple-500" /> Yönetim Paneli
                                                </Link>
                                            )}
                                            <button onClick={() => { signOut(); closeProfile() }} className="w-full text-left flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                                                <LogOut className="w-4 h-4 mr-3" /> Çıkış Yap
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link href="/api/auth/signin" className="bg-primary text-white px-6 py-2.5 rounded-full font-bold hover:bg-green-400 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md text-sm">
                                    Giriş Yap
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 hover:text-primary focus:outline-none bg-white/50 p-2 rounded-full">
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute top-full left-4 right-4 mt-2 bg-white/95 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-4 md:hidden animate-in slide-in-from-top-4 duration-300 z-50">
                    <div className="space-y-2">
                        {displayLinks.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={closeMenu}
                                className="block px-4 py-3 rounded-xl text-base font-bold text-gray-700 hover:text-primary hover:bg-green-50 transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="h-px bg-gray-100 my-2"></div>
                        {session ? (
                            <>
                                <Link href="/profile" onClick={closeMenu} className="block px-4 py-3 rounded-xl text-base font-bold text-gray-700 hover:text-primary hover:bg-green-50">Profilim</Link>
                                {(session.user.role === "ADMIN" || session.user.role === "MEMBER") && (
                                    <Link href="/admin" onClick={closeMenu} className="block px-4 py-3 rounded-xl text-base font-bold text-gray-700 hover:text-purple-600 hover:bg-purple-50">Yönetim Paneli</Link>
                                )}
                                <button onClick={() => { signOut(); closeMenu() }} className="block w-full text-left px-4 py-3 rounded-xl text-base font-bold text-red-600 hover:bg-red-50">Çıkış Yap</button>
                            </>
                        ) : (
                            <Link href="/api/auth/signin" onClick={closeMenu} className="block w-full text-center px-4 py-3 rounded-xl text-base font-bold bg-primary text-white hover:bg-green-400 shadow-md">Giriş Yap</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

