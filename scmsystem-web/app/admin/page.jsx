"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // HATA BURADAYDI: Bu satır eksikti
import { Users, PlusCircle, LayoutDashboard, ShieldCheck } from "lucide-react";
import { getAllClubs } from "../actions";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
    const router = useRouter();
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Admin yetkisi kontrolü
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            router.push("/login");
            return;
        }
        try {
            const user = JSON.parse(userStr);
            if (user.role !== 'ADMIN') {
                router.push("/login"); 
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
                {/* Üst Başlık */}
                <header className="flex items-center space-x-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="bg-blue-900 p-3 rounded-xl">
                        <LayoutDashboard className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Yönetim Paneli</h1>
                        <p className="text-zinc-500">Sistem ayarlarını ve kulüpleri yönetin.</p>
                    </div>
                </header>

                {/* Hızlı İşlem Kartları */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link href="/admin/create-club" className="group block bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-all hover:border-blue-500/50">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                                <PlusCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">Kulüp Ekle</h2>
                        <p className="text-zinc-500 text-sm">Sisteme yeni bir öğrenci kulübü tanımlayın.</p>
                    </Link>
                </div>

                <div className="pt-8">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Mevcut Kulüpler ve Başvurular</h2>

                    {loading ? (
                        <div className="text-center py-10 text-zinc-400">Yükleniyor...</div>
                    ) : clubs.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                            <p className="text-zinc-500">Henüz hiç kulüp eklenmemiş.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {clubs.map(club => (
                                <div key={club.id} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
                                    
                                    {/* Kulüp Bilgisi */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-xl overflow-hidden shrink-0">
                                            {club.logoLink ? (
                                                <img src={club.logoLink} className="w-full h-full object-cover" alt="logo" />
                                            ) : (
                                                <Users className="w-6 h-6 text-blue-600" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-zinc-900 dark:text-white line-clamp-1" title={club.name}>
                                                {club.name}
                                            </h3>
                                            <span className="text-xs text-zinc-500">ID: {club.id}</span>
                                        </div>
                                    </div>

                                    {/* Buton Kısmı */}
                                    <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-2">
                                        {/* 1. Buton: Başvurular */}
                                        <Link href={`/admin/applications/${club.id}`} className="w-full">
                                            <Button className="w-full bg-blue-900 hover:bg-blue-800 text-white h-9 text-xs">
                                                <Users className="w-3 h-3 mr-2" />
                                                Başvuruları Yönet
                                            </Button>
                                        </Link>

                                        {/* 2. Buton: Üyeler */}
                                        <Link href={`/admin/members/${club.id}`} className="w-full">
                                            <Button variant="outline" className="w-full h-9 text-xs border-blue-200 text-blue-700 hover:bg-blue-50">
                                                <ShieldCheck className="w-3 h-3 mr-2" />
                                                Üyeleri Görüntüle
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}