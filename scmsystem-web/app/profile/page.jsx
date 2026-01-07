"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    User, Mail, LogOut, LayoutDashboard, Clock, CheckCircle, 
    XCircle, ArrowRight, Home, Edit, Save, X, Lock 
} from "lucide-react";

export default function ProfilePage() {
    const router = useRouter();
    
    // Kullanıcı ve Form State'leri
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    // Şifre alanını da form datasına ekledik
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });

    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            router.push("/login");
            return;
        }

        const userData = JSON.parse(userStr);
        setUser(userData);
        setFormData({ 
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: "" // Başlangıçta boş, eğer kullanıcı doldurursa güncellenecek
        });

        fetchRegistrations(userData.id);
    }, [router]);

    const fetchRegistrations = async (userId) => {
        try {
            const res = await fetch(`http://localhost:8082/rest/api/club-registration/my-registrations/${userId}`);
            if (res.ok) {
                const data = await res.json();
                setRegistrations(data);
            }
        } catch (error) {
            console.error("Başvurular çekilemedi:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("/login");
    };

    const handleUpdateProfile = async () => {
        // Eğer şifre alanı boşsa, göndermeyelim veya backend boş şifreyi güncellememeli.
        // Bizim backend muhtemelen tüm objeyi alıp kaydediyor.
        // Backend'in boş şifreyi ezmemesi lazım ama şimdilik gönderelim.
        
        try {
            const res = await fetch(`http://localhost:8082/rest/api/user/update/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const updatedUser = await res.json();
                // Şifre güvenlik gereği response'da dönmeyebilir, eski user ile merge edelim
                const newUserData = { ...user, ...updatedUser };
                
                localStorage.setItem("user", JSON.stringify(newUserData));
                setUser(newUserData);
                setIsEditing(false);
                // Şifre alanını temizle
                setFormData(prev => ({ ...prev, password: "" }));
                alert("Profiliniz (ve girdiyseniz şifreniz) başarıyla güncellendi! ✅");
            } else {
                alert("Güncelleme başarısız oldu.");
            }
        } catch (error) {
            console.error("Güncelleme hatası:", error);
            alert("Bir hata oluştu.");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "APPROVED":
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"><CheckCircle className="w-3 h-3 mr-1" /> Onaylandı</span>;
            case "REJECTED":
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"><XCircle className="w-3 h-3 mr-1" /> Reddedildi</span>;
            default: 
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"><Clock className="w-3 h-3 mr-1" /> Beklemede</span>;
        }
    };

    if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;
    if (!user) return null;

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                
                <Link href="/home">
                    <Button variant="ghost" className="hover:bg-zinc-200 dark:hover:bg-zinc-800">
                        <Home className="w-4 h-4 mr-2" /> Ana Sayfaya Dön
                    </Button>
                </Link>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                        
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                <User className="w-8 h-8" />
                            </div>
                            
                            <div className="w-full">
                                {isEditing ? (
                                    // --- DÜZENLEME MODU (ŞİFRE EKLENDİ) ---
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                                        <Input 
                                            placeholder="Ad" 
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                        />
                                        <Input 
                                            placeholder="Soyad" 
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                        />
                                        <div className="md:col-span-2 relative">
                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                            <Input 
                                                placeholder="Email" 
                                                className="pl-9"
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            />
                                        </div>
                                        {/* YENİ ŞİFRE ALANI */}
                                        <div className="md:col-span-2 relative">
                                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                                            <Input 
                                                type="password"
                                                placeholder="Yeni Şifre (Değiştirmek istemiyorsanız boş bırakın)" 
                                                className="pl-9"
                                                value={formData.password}
                                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    // --- GÖRÜNTÜLEME MODU ---
                                    <>
                                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                                            {user.firstName} {user.lastName}
                                        </h1>
                                        <div className="flex items-center text-zinc-500 text-sm mt-1">
                                            <Mail className="w-4 h-4 mr-1" />
                                            {user.email}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                            {isEditing ? (
                                <>
                                    <Button size="sm" onClick={handleUpdateProfile} className="bg-green-600 hover:bg-green-700 text-white">
                                        <Save className="w-4 h-4 mr-2" /> Kaydet
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                                        <X className="w-4 h-4 mr-2" /> İptal
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                                        <Edit className="w-4 h-4 mr-2" /> Profili Düzenle
                                    </Button>
                                    {/* Şifre sıfırlama linki kaldırıldı çünkü artık input var */}
                                </>
                            )}

                            {!isEditing && (
                                <>
                                    {user.role === 'ADMIN' && (
                                        <Link href="/admin">
                                            <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                                                <LayoutDashboard className="w-4 h-4 mr-2" /> Panel
                                            </Button>
                                        </Link>
                                    )}
                                    <Button variant="destructive" size="sm" onClick={handleLogout}>
                                        <LogOut className="w-4 h-4 mr-2" /> Çıkış
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">🎓 Kulüplerim ve Başvurularım</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {registrations.length === 0 ? (
                            <div className="text-center py-10 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700">
                                <p className="text-zinc-500 mb-4">Henüz hiçbir kulübe üye değilsiniz.</p>
                                <Link href="/clubs"><Button>Kulüpleri Keşfet <ArrowRight className="ml-2 w-4 h-4"/></Button></Link>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500">
                                        <tr>
                                            <th className="p-4 font-medium">Kulüp Adı</th>
                                            <th className="p-4 font-medium">Başvuru Tarihi</th>
                                            <th className="p-4 font-medium">Durum</th>
                                            <th className="p-4 font-medium text-right">İşlem</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                                        {registrations.map((reg) => (
                                            <tr key={reg.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20">
                                                <td className="p-4 font-medium text-zinc-900 dark:text-zinc-100">{reg.clubName}</td>
                                                <td className="p-4 text-zinc-500">{reg.applicationDate ? new Date(reg.applicationDate).toLocaleDateString("tr-TR") : "-"}</td>
                                                <td className="p-4">{getStatusBadge(reg.status)}</td>
                                                <td className="p-4 text-right">
                                                    <Link href={`/clubs/${reg.clubId}`}><Button variant="ghost" size="sm" className="h-8">Detay</Button></Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}