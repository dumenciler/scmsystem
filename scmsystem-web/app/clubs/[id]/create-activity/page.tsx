"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createActivity } from "../../../actions"; // Adjusted path: app/clubs/[id]/create-activity -> ../../../actions
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Loader2, CalendarPlus } from "lucide-react";

// Adjusted path: if page is in app/clubs/[id]/create-activity/page.tsx
// app/clubs/[id]/create-activity -> ../../../actions (app/actions) looks correct?
// app/clubs/[id]/create-activity/page.tsx
// app/clubs/[id]/page.jsx was ../../actions
// So yes, ../../../actions

export default function CreateActivityPage() {
    const params = useParams();
    const router = useRouter();
    const clubId = params.id;

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        activityDate: "",
        time: ""
    });
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const u = JSON.parse(userStr);
                if (u.role === "ADMIN") {
                    setIsAdmin(true);
                } else {
                    // Not admin
                    alert("Yetkisiz işlem. Sadece yöneticiler etkinlik oluşturabilir.");
                    router.push(`/clubs/${clubId}`);
                }
            } catch (e) {
                router.push(`/clubs/${clubId}`);
            }
        } else {
            router.push("/login");
        }
        setCheckingAuth(false);
    }, [clubId, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Combine date and time
        // activityDate format: YYYY-MM-DD
        // time format: HH:mm
        const combinedDate = new Date(`${formData.activityDate}T${formData.time}:00`);

        const payload = {
            title: formData.title,
            description: formData.description,
            activityDate: combinedDate.toISOString(),
            clubId: parseInt(clubId)
        };

        const res = await createActivity(payload);
        if (res.success) {
            alert("Etkinlik başarıyla oluşturuldu!");
            router.push(`/clubs/${clubId}`);
        } else {
            alert("Hata: " + res.message);
        }
        setLoading(false);
    };

    if (checkingAuth) return <div className="p-10 text-center">Yetki kontrolü...</div>;
    if (!isAdmin) return null;

    return (
        <div className="container mx-auto py-10 px-4 max-w-2xl">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" /> Geri Dön
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center text-2xl">
                        <CalendarPlus className="mr-2" /> Yeni Etkinlik Oluştur
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Etkinlik Başlığı</label>
                            <Input
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Örn: Tanışma Toplantısı"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Açıklama</label>
                            <Textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Etkinlik detayları..."
                                rows={5}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Tarih</label>
                                <Input
                                    type="date"
                                    required
                                    value={formData.activityDate}
                                    onChange={(e) => setFormData({ ...formData, activityDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Saat</label>
                                <Input
                                    type="time"
                                    required
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <><Loader2 className="animate-spin mr-2" /> Oluşturuluyor...</> : "Etkinliği Yayınla"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
