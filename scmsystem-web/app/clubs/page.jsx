"use client";

import { useState, useEffect } from "react";
import { getAllClubs } from "../actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users } from "lucide-react";
import { ClubCard } from "@/components/ClubCard"; // Düzeltiğimiz bileşeni buraya çağırıyoruz

export default function ClubsPage() {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Rol kontrolü
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

        // Kulüpleri çek
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

                {/* Başlık */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Öğrenci Kulüpleri</h1>
                        <p className="text-zinc-500">Kampüsteki tüm aktif kulüpleri keşfedin.</p>
                    </div>

                    {/* Admin ise Ekle butonu görünür */}
                    {isAdmin && (
                        <Link href="/admin/create-club">
                            <Button className="bg-blue-600 hover:bg-blue-500 text-white gap-2">
                                <PlusCircle className="w-4 h-4" />
                                Yeni Kulüp Ekle
                            </Button>
                        </Link>
                    )}
                </header>

                {/* İçerik */}
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
                            // ARTIK HAZIR BİLEŞENİ KULLANIYORUZ, NAVİGASYON DÜZELDİ
                            <ClubCard key={club.id} club={club} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}