"use client";

import { useState, useEffect } from "react";
import { getAllClubs } from "../actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, ExternalLink } from "lucide-react";

export default function ClubsPage() {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check role
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.role === 'ADMIN') {
                    setIsAdmin(true);
                }
            } catch (e) {
                // ignore
            }
        }

        // Fetch clubs
        async function fetchClubs() {
            setLoading(true);
            const result = await getAllClubs();
            if (result.success) {
                setClubs(result.data);
            }
            setLoading(false);
        }
        fetchClubs();
    }, []);

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Öğrenci Kulüpleri</h1>
                        <p className="text-zinc-500">Kampüsteki tüm aktif kulüpleri keşfedin.</p>
                    </div>

                    {/* Conditional Admin Button */}
                    {isAdmin && (
                        <Link href="/admin/create-club">
                            <Button className="bg-blue-600 hover:bg-blue-500 text-white gap-2">
                                <PlusCircle className="w-4 h-4" />
                                Yeni Kulüp Ekle
                            </Button>
                        </Link>
                    )}
                </header>

                {/* Content */}
                {loading ? (
                    <div className="text-center py-20 text-zinc-500">Yükleniyor...</div>
                ) : clubs.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
                        <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-zinc-900 dark:text-white">Henüz Kulüp Yok</h3>
                        <p className="text-zinc-500">Sisteme kayıtlı bir kulüp bulunmuyor.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clubs.map((club) => (
                            <div key={club.id} className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-lg transition-all flex flex-col h-full">
                                <div className="p-6 flex-1 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-xl font-bold text-zinc-500">
                                            {club.logoLink ? (
                                                <img src={club.logoLink} alt={club.name} className="w-full h-full object-cover rounded-xl" />
                                            ) : (
                                                club.name.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{club.name}</h3>
                                        <p className="text-zinc-500 text-sm line-clamp-3">
                                            {club.description || "Açıklama yok."}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                                    <Button variant="ghost" className="w-full justify-between text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
                                        Kulübü İncele
                                        <ExternalLink className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
