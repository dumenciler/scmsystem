"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getActivityById, applyToActivity, getClubRegistrationsByUserId } from "../../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, Loader2, CheckCircle } from "lucide-react";

export default function ActivityDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const activityId = params.id;

    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [registrationStatus, setRegistrationStatus] = useState(null); // Club membership status
    const [hasApplied, setHasApplied] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const u = JSON.parse(userStr);
                setCurrentUserId(u.id);
            } catch (e) { }
        }
    }, []);

    useEffect(() => {
        async function loadData() {
            if (!activityId) return;
            setLoading(true);
            const act = await getActivityById(activityId);
            setActivity(act);

            if (act && currentUserId) {
                // Check club membership
                // Since we don't have a direct "check if member" easily accessible without list or passing clubId to a new endpoint...
                // We can use getClubRegistrationsByUserId
                const resRegs = await fetch(`http://localhost:8082/rest/api/club-registration/my-registrations/${currentUserId}`);
                if (resRegs.ok) {
                    const regs = await resRegs.json();
                    const myRg = regs.find(r => r.club.id === act.club.id);
                    if (myRg) {
                        setRegistrationStatus(myRg.status);
                    }
                }

                // Check if already applied to activity
                const resApps = await fetch(`http://localhost:8082/rest/api/activity/my-applications/${currentUserId}`);
                if (resApps.ok) {
                    const apps = await resApps.json();
                    const myApp = apps.find(a => a.activity.id === parseInt(activityId));
                    if (myApp) {
                        setHasApplied(true);
                    }
                }
            }
            setLoading(false);
        }
        loadData();
    }, [activityId, currentUserId]);

    const handleApply = async () => {
        if (!currentUserId) {
            alert("Lütfen giriş yapın.");
            return;
        }
        setApplying(true);
        const res = await applyToActivity(currentUserId, activityId);
        if (res.success) {
            setHasApplied(true);
            alert(res.message);
        } else {
            alert(res.message);
        }
        setApplying(false);
    };

    if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;
    if (!activity) return <div className="p-10 text-center">Etkinlik bulunamadı.</div>;

    const isMember = registrationStatus === 'APPROVED';

    return (
        <div className="container mx-auto py-10 px-4 max-w-3xl">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" /> Geri Dön
            </Button>

            <Card>
                <CardHeader>
                    <div className="text-blue-600 font-bold mb-2">{activity.club?.name}</div>
                    <CardTitle className="text-3xl">{activity.title}</CardTitle>
                    <div className="flex flex-col sm:flex-row text-zinc-500 mt-2 gap-4">
                        <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {new Date(activity.activityDate).toLocaleDateString('tr-TR')}</div>
                        <div className="flex items-center"><Clock className="w-4 h-4 mr-2" /> {new Date(activity.activityDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                        <p className="whites-pre-wrap">{activity.description}</p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end p-6 bg-zinc-50 dark:bg-zinc-900/50">
                    {hasApplied ? (
                        <Button disabled className="bg-green-600 text-white">
                            <CheckCircle className="w-4 h-4 mr-2" /> Başvuru Yapıldı
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            onClick={handleApply}
                            disabled={!isMember || applying || !activity.isActive}
                            className={!isMember ? "opacity-50 cursor-not-allowed" : ""}
                        >
                            {applying ? <><Loader2 className="animate-spin mr-2" /> İşleniyor...</> :
                                (!isMember ? "Sadece Kulüp Üyeleri Başvurabilir" : "Etkinliğe Başvur")}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
