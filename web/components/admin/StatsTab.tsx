"use client"

import React from "react"
import { Users, CheckCircle, Calendar, MessageSquare, TrendingUp, TrendingDown, ArrowUp, ArrowDown, Activity } from "lucide-react"

interface StatsTabProps {
    wishes: any[]
    users: any[]
    events: any[]
    messages: any[]
}

export default function StatsTab({ wishes, users, events, messages }: StatsTabProps) {

    // Helper to calculate weekly growth
    const calculateWeeklyGrowth = (data: any[]) => {
        const now = new Date()
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

        const thisWeek = data.filter(d => new Date(d.createdAt) >= oneWeekAgo).length
        const lastWeek = data.filter(d => new Date(d.createdAt) >= twoWeeksAgo && new Date(d.createdAt) < oneWeekAgo).length

        if (lastWeek === 0) return { percent: thisWeek > 0 ? 100 : 0, direction: 'up' }
        const diff = ((thisWeek - lastWeek) / lastWeek) * 100
        return { percent: Math.round(Math.abs(diff)), direction: diff >= 0 ? 'up' : 'down' }
    }

    const userGrowth = calculateWeeklyGrowth(users)
    const wishGrowth = calculateWeeklyGrowth(wishes)
    const eventGrowth = calculateWeeklyGrowth(events)

    // Chart Data Preparation (Last 6 Months)
    const getMonthlyData = (data: any[]) => {
        const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]
        const result = new Array(6).fill(0).map((_, i) => {
            const d = new Date()
            d.setMonth(d.getMonth() - (5 - i))
            return {
                name: months[d.getMonth()],
                count: 0
            }
        })

        data.forEach(item => {
            const date = new Date(item.createdAt)
            const monthDiff = (new Date().getFullYear() - date.getFullYear()) * 12 + (new Date().getMonth() - date.getMonth())
            if (monthDiff < 6 && monthDiff >= 0) {
                result[5 - monthDiff].count++
            }
        })
        return result
    }

    const userChartData = getMonthlyData(users)
    const wishChartData = getMonthlyData(wishes)

    // Calculate max for scaling charts
    const maxUserCount = Math.max(...userChartData.map(d => d.count), 1)
    const maxWishCount = Math.max(...wishChartData.map(d => d.count), 1)

    // Status Distribution
    const wishStatus = {
        PENDING: wishes.filter(w => w.status === "PENDING").length,
        IN_PROCESS: wishes.filter(w => w.status === "IN_PROCESS").length,
        COMPLETED: wishes.filter(w => w.status === "COMPLETED").length,
    }
    const totalWishes = wishes.length || 1

    const onlineUsersCount = users.filter(u => {
        if (!u.lastActive) return false
        const diff = new Date().getTime() - new Date(u.lastActive).getTime()
        return diff < 5 * 60 * 1000 // 5 minutes
    }).length

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-24 h-24 text-blue-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                <Users className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-gray-500 text-sm uppercase tracking-wide">Toplam Üye</span>
                        </div>
                        <h3 className="text-4xl font-black text-gray-900 mb-2">{users.length}</h3>
                        <div className={`flex items-center gap-1 text-xs font-bold ${userGrowth.direction === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                            {userGrowth.direction === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                            <span>%{userGrowth.percent}</span>
                            <span className="text-gray-400 font-medium ml-1">geçen haftaya göre</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="w-24 h-24 text-green-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-50 text-green-600 rounded-xl">
                                <Activity className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-gray-500 text-sm uppercase tracking-wide">Çevrimiçi</span>
                        </div>
                        <h3 className="text-4xl font-black text-gray-900 mb-2">{onlineUsersCount}</h3>
                        <div className="flex items-center gap-1 text-xs font-bold text-green-600">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Şu an aktif
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CheckCircle className="w-24 h-24 text-emerald-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-gray-500 text-sm uppercase tracking-wide">Toplam Dilek</span>
                        </div>
                        <h3 className="text-4xl font-black text-gray-900 mb-2">{wishes.length}</h3>
                        <div className={`flex items-center gap-1 text-xs font-bold ${wishGrowth.direction === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                            {wishGrowth.direction === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                            <span>%{wishGrowth.percent}</span>
                            <span className="text-gray-400 font-medium ml-1">geçen haftaya göre</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Calendar className="w-24 h-24 text-purple-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-gray-500 text-sm uppercase tracking-wide">Etkinlikler</span>
                        </div>
                        <h3 className="text-4xl font-black text-gray-900 mb-2">{events.length}</h3>
                        <div className={`flex items-center gap-1 text-xs font-bold ${eventGrowth.direction === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                            {eventGrowth.direction === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                            <span>%{eventGrowth.percent}</span>
                            <span className="text-gray-400 font-medium ml-1">geçen haftaya göre</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <MessageSquare className="w-24 h-24 text-orange-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-gray-500 text-sm uppercase tracking-wide">Bekleyen Mesaj</span>
                        </div>
                        <h3 className="text-4xl font-black text-gray-900 mb-2">{messages.filter(m => !m.isRead).length}</h3>
                        <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                            Toplam {messages.length} mesaj
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Growth Chart (Custom Bar Chart) */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Üye Artışı</h3>
                            <p className="text-sm text-gray-500 font-medium">Son 6 ay</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold bg-green-50 text-green-700 px-3 py-1 rounded-full">
                            <TrendingUp className="w-4 h-4" />
                            Trend Pozitif
                        </div>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-4">
                        {userChartData.map((data, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="relative w-full flex justify-center">
                                    <div
                                        className="w-full max-w-[40px] bg-blue-100 rounded-t-xl group-hover:bg-blue-500 transition-all duration-300 relative"
                                        style={{ height: `${(data.count / maxUserCount) * 200}px`, minHeight: '10px' }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                            {data.count} Üye
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-gray-400 group-hover:text-blue-500 transition-colors">{data.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Wish Status Breakdown (Custom Donut) */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-8">Dilek Durumu</h3>
                    <div className="relative w-full aspect-square max-w-[250px] mx-auto mb-8">
                        <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                            {/* Background Circle */}
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="20" />

                            {/* Segments - Simplified calculation for demo */}
                            {(() => {
                                let offset = 0;
                                const circumference = 2 * Math.PI * 40;

                                const segments = [
                                    { color: "#10b981", count: wishStatus.COMPLETED }, // Emerald
                                    { color: "#3b82f6", count: wishStatus.IN_PROCESS }, // Blue
                                    { color: "#f59e0b", count: wishStatus.PENDING },   // Amber
                                ];

                                return segments.map((seg, i) => {
                                    const percent = seg.count / totalWishes;
                                    const length = percent * circumference;
                                    const strokeDasharray = `${length} ${circumference}`;
                                    const strokeDashoffset = -offset;
                                    offset += length;

                                    if (seg.count === 0) return null;

                                    return (
                                        <circle
                                            key={i}
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="none"
                                            stroke={seg.color}
                                            strokeWidth="20"
                                            strokeDasharray={strokeDasharray}
                                            strokeDashoffset={strokeDashoffset}
                                            className="transition-all duration-1000 ease-out hover:opacity-90"
                                        />
                                    )
                                })
                            })()}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-gray-900">{wishes.length}</span>
                            <span className="text-xs font-bold text-gray-400 uppercase">Toplam</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                <span className="text-sm font-bold text-gray-600">Tamamlanan</span>
                            </div>
                            <span className="font-black text-gray-900">{wishStatus.COMPLETED}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-sm font-bold text-gray-600">Süreçte</span>
                            </div>
                            <span className="font-black text-gray-900">{wishStatus.IN_PROCESS}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <span className="text-sm font-bold text-gray-600">Bekleyen</span>
                            </div>
                            <span className="font-black text-gray-900">{wishStatus.PENDING}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
