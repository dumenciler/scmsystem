"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowLeft, Loader2, Calendar } from "lucide-react";

export default function ClubApplicationsPage() {
    const params = useParams();
    const router = useRouter();
    const clubId = params.id;

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null); // Hangi butona basıldığını takip etmek için

    // Başvuruları Getir
    const fetchApplications = async () => {
        try {
            const res = await fetch(`http://localhost:8082/rest/api/club-registration/list/${clubId}`);
            if (res.ok) {
                const data = await res.json();
                // Sadece PENDING (Bekleyen) olanları filtreleyip gösterelim
                // (İstersen hepsini gösterip status'e göre renklendirebilirsin)
                const pendingApps = data.filter(app => app.status === 'PENDING');
                setApplications(pendingApps);
            }
        } catch (error) {
            console.error("Başvurular yüklenemedi:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (clubId) fetchApplications();
    }, [clubId]);

    // Onaylama / Reddetme İşlemi
    const handleStatusChange = async (registrationId, action) => {
        // action: 'approve' veya 'reject'
        setProcessingId(registrationId);
        try {
            const res = await fetch(
                `http://localhost:8082/rest/api/club-registration/${action}/${registrationId}`, 
                { method: "PUT" }
            );

            if (res.ok) {
                // İşlem başarılıysa listeyi yenile (veya listeden o elemanı çıkar)
                setApplications(prev => prev.filter(app => app.id !== registrationId));
                // Opsiyonel: Toast mesajı gösterilebilir
            } else {
                alert("İşlem başarısız oldu.");
            }
        } catch (error) {
            console.error("Hata:", error);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                
                {/* Başlık */}
                <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Başvuru Yönetimi</h1>
                        <p className="text-zinc-500 text-sm">Kulübünüze gelen üyelik isteklerini yönetin.</p>
                    </div>
                </div>

                {/* Liste */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    {loading ? (
                        <div className="p-10 text-center text-zinc-500">Yükleniyor...</div>
                    ) : applications.length === 0 ? (
                        <div className="p-10 text-center text-zinc-500 flex flex-col items-center gap-2">
                            <span className="text-4xl">📭</span>
                            <p>Bekleyen başvuru bulunmuyor.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800 text-zinc-500">
                                <tr>
                                    <th className="p-4 font-medium">Kullanıcı Adı</th>
                                    <th className="p-4 font-medium">Başvuru Tarihi</th>
                                    <th className="p-4 font-medium text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {applications.map((app) => (
                                    <tr key={app.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                                        <td className="p-4 font-medium text-zinc-900 dark:text-zinc-100">
                                            {app.userName || "İsimsiz Kullanıcı"}
                                        </td>
                                        <td className="p-4 text-zinc-500 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-zinc-400" />
                                            {app.applicationDate ? new Date(app.applicationDate).toLocaleDateString("tr-TR") : "-"}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <Button 
                                                size="sm" 
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                                onClick={() => handleStatusChange(app.id, 'approve')}
                                                disabled={processingId === app.id}
                                            >
                                                {processingId === app.id ? <Loader2 className="w-4 h-4 animate-spin"/> : <Check className="w-4 h-4 mr-1" />}
                                                Onayla
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="destructive"
                                                onClick={() => handleStatusChange(app.id, 'reject')}
                                                disabled={processingId === app.id}
                                            >
                                                <X className="w-4 h-4 mr-1" />
                                                Reddet
                                            </Button>
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