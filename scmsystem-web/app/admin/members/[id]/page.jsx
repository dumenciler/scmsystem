"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCheck } from "lucide-react";

export default function ClubMembersPage() {
    const params = useParams();
    const router = useRouter();
    const clubId = params.id;

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Üyeleri Getir
    const fetchMembers = async () => {
        try {
            // Backend'den tüm listeyi çekiyoruz
            const res = await fetch(`http://localhost:8082/rest/api/club-registration/list/${clubId}`);
            if (res.ok) {
                const data = await res.json();
                // Sadece ONAYLI (APPROVED) olanları filtrele
                const activeMembers = data.filter(app => app.status === 'APPROVED');
                setMembers(activeMembers);
            }
        } catch (error) {
            console.error("Üyeler yüklenemedi:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (clubId) fetchMembers();
    }, [clubId]);

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                
                {/* Başlık ve Geri Dön */}
                <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <UserCheck className="w-6 h-6 text-green-600" />
                            Aktif Üye Listesi
                        </h1>
                        <p className="text-zinc-500 text-sm">Bu kulübe kaydı onaylanmış öğrencilerin listesidir.</p>
                    </div>
                </div>

                {/* Liste */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    {loading ? (
                        <div className="p-10 text-center text-zinc-500">Yükleniyor...</div>
                    ) : members.length === 0 ? (
                        <div className="p-10 text-center text-zinc-500 flex flex-col items-center gap-2">
                            <span className="text-4xl">👥</span>
                            <p>Bu kulübün henüz onaylı bir üyesi bulunmuyor.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800 text-zinc-500">
                                <tr>
                                    <th className="p-4 font-medium"># ID</th>
                                    <th className="p-4 font-medium">Ad Soyad</th>
                                    <th className="p-4 font-medium">Üyelik Tarihi</th>
                                    <th className="p-4 font-medium text-right">Durum</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {members.map((member) => (
                                    <tr key={member.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                                        <td className="p-4 font-mono text-zinc-400 text-xs">
                                            #{member.userId}
                                        </td>
                                        <td className="p-4 font-medium text-zinc-900 dark:text-zinc-100">
                                            {member.userName || "İsimsiz Kullanıcı"}
                                        </td>
                                        <td className="p-4 text-zinc-500">
                                            {member.applicationDate ? new Date(member.applicationDate).toLocaleDateString("tr-TR") : "-"}
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Aktif Üye
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </main>
    );
}