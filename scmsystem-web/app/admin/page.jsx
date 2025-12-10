"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { Users, PlusCircle, LayoutDashboard } from "lucide-react";
import { getAllClubs } from "../actions";
import { ClubCard } from "@/components/ClubCard";
import { useState } from "react";

export default function AdminDashboardPage() {
    const router = useRouter();
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            router.push("/login");
            return;
        }
        try {
            const user = JSON.parse(userStr);
            if (user.role !== 'ADMIN') {
                router.push("/login"); // or / for unauthorized
            }
        } catch (e) {
            router.push("/login");
        }
        fetchClubs();
    }, [router]);

    const fetchClubs = async () => {
        const result = await getAllClubs();
        if (result.success) {
            setClubs(result.data);
        }
        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex items-center space-x-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="bg-blue-900 p-3 rounded-xl">
                        <LayoutDashboard className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Yönetim Paneli</h1>
                        <p className="text-zinc-500">Sistem ayarlarını ve kulüpleri yönetin.</p>

                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1: Create Club */}
                    <Link href="/admin/create-club" className="group block bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-all hover:border-blue-500/50">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                                <PlusCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">Kulüp Ekle</h2>
                        <p className="text-zinc-500 text-sm">Sisteme yeni bir öğrenci kulübü tanımlayın.</p>
                    </Link>

                    {/* Placeholder for future admin features */}
                    <div className="block bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl p-6 border border-transparent border-dashed border-zinc-300 dark:border-zinc-700 opacity-60 cursor-not-allowed">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-zinc-200 dark:bg-zinc-800 rounded-lg">
                                <Users className="w-6 h-6 text-zinc-400" />
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">Kullanıcı Yönetimi</h2>
                        <p className="text-zinc-500 text-sm">Çok yakında...</p>
                    </div>
                </div>

                <div className="pt-8">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Mevcut Kulüpler</h2>

                    {loading ? (
                        <div className="text-center py-10 text-zinc-400">Yükleniyor...</div>
                    ) : clubs.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                            <p className="text-zinc-500">Henüz hiç kulüp eklenmemiş.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {clubs.map(club => (
                                <ClubCard key={club.id} club={club} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
