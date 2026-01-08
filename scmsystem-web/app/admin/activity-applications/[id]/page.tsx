"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getActivitiesByClub } from "../../../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Check, X, Loader2 } from "lucide-react";

// Helper for fetching applications per activity
// We didn't export getApplicationsByActivity in actions.js? Wait, I think I missed adding it to actions.js?
// I added `applyToActivity` and `getClubRegistrationsByUserId`.
// But I need to fetch applications for an activity to approve/deny them.
// Backend endpoint: `GET /rest/api/activity/applications/{activityId}`
// I'll fetch directly here for now or assuming I should have added it.
// I'll use fetch directly.

export default function ManageApplicationsPage() {
    const params = useParams();
    const router = useRouter();
    const clubId = params.id;

    const [activities, setActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loadingActivities, setLoadingActivities] = useState(true);
    const [loadingApps, setLoadingApps] = useState(false);
    const [processingId, setProcessingId] = useState(null);

    // Auth Check (Admin only)
    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (!userStr || JSON.parse(userStr).role !== "ADMIN") {
            // alert("Yetkisiz işlem."); // Removed alert to be less intrusive on redirect
            // router.push(`/clubs/${clubId}`); // Redirecting to club page or home
            router.push(`/`);
        }
    }, [router, clubId]);

    // Load Activities
    useEffect(() => {
        async function load() {
            setLoadingActivities(true);
            const res = await getActivitiesByClub(clubId);
            if (res.success) {
                setActivities(res.data);
            }
            setLoadingActivities(false);
        }
        load();
    }, [clubId]);

    // Load Applications when activity selected
    useEffect(() => {
        async function loadApps() {
            if (!selectedActivity) return;
            setLoadingApps(true);
            try {
                const res = await fetch(`http://localhost:8082/rest/api/activity/applications/${selectedActivity.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setApplications(data);
                }
            } catch (e) { }
            setLoadingApps(false);
        }
        loadApps();
    }, [selectedActivity]);

    const handleStatusChange = async (appId, newStatus) => {
        setProcessingId(appId);
        const endpoint = newStatus === 'APPROVED' ? 'approve' : 'reject';
        try {
            const res = await fetch(`http://localhost:8082/rest/api/activity/${endpoint}/${appId}`, {
                method: 'PUT'
            });
            if (res.ok) {
                // Update list
                setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
            } else {
                alert("İşlem başarısız.");
            }
        } catch (e) {
            alert("Hata oluştu.");
        }
        setProcessingId(null);
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" /> Geri Dön
            </Button>

            <h1 className="text-3xl font-bold mb-8">Etkinlik Başvurularını Yönet</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* List of Activities */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle>Etkinlikler</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {loadingActivities && <Loader2 className="animate-spin" />}
                        {activities.map(act => (
                            <div
                                key={act.id}
                                onClick={() => setSelectedActivity(act)}
                                className={`p-3 rounded cursor-pointer transition-colors ${selectedActivity?.id === act.id ? 'bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-600' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                            >
                                <div className="font-semibold">{act.title}</div>
                                <div className="text-xs text-zinc-500">{new Date(act.activityDate).toLocaleDateString('tr-TR')}</div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Applications List */}
                <Card className="md:col-span-2 min-h-[400px]">
                    <CardHeader>
                        <CardTitle>
                            {selectedActivity ? `'${selectedActivity.title}' Başvuruları` : 'Bir etkinlik seçin'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!selectedActivity ? (
                            <div className="text-center text-zinc-500 mt-20">Başvuruları görmek için soldan bir etkinlik seçin.</div>
                        ) : (
                            <>
                                {loadingApps && <div className="text-center"><Loader2 className="animate-spin inline" /> Yükleniyor...</div>}
                                {!loadingApps && applications.length === 0 && <div className="text-center text-zinc-500">Bu etkinlik için başvuru yok.</div>}
                                <div className="space-y-4">
                                    {applications.map(app => (
                                        <div key={app.id} className="flex flex-col sm:flex-row justify-between items-center p-4 border rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                                            <div className="mb-4 sm:mb-0">
                                                <div className="font-bold">{app.user.firstName} {app.user.lastName} <span className="text-xs font-normal text-zinc-500">(@{app.user.username})</span></div>
                                                <div className="text-xs text-zinc-500">Başvuru: {new Date(app.applicationDate).toLocaleString('tr-TR')}</div>
                                                <div className="mt-1">
                                                    <span className={`text-xs px-2 py-1 rounded ${app.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                        app.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {app.status === 'APPROVED' ? 'Onaylandı' : app.status === 'REJECTED' ? 'Reddedildi' : 'Bekliyor'}
                                                    </span>
                                                </div>
                                            </div>
                                            {app.status === 'PENDING' && (
                                                <div className="flex space-x-2">
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => handleStatusChange(app.id, 'APPROVED')}
                                                        disabled={processingId === app.id}
                                                    >
                                                        <Check className="w-4 h-4 mr-1" /> Onayla
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleStatusChange(app.id, 'REJECTED')}
                                                        disabled={processingId === app.id}
                                                    >
                                                        <X className="w-4 h-4 mr-1" /> Reddet
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
