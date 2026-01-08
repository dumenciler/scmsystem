"use client";

import React, { useEffect, useState } from "react";
import { getAllActivities } from "../actions";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";

export default function ActivitiesPage() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadActivities() {
            setLoading(true);
            const res = await getAllActivities();
            if (res.success) {
                setActivities(res.data);
            }
            setLoading(false);
        }
        loadActivities();
    }, []);

    if (loading) return <div className="text-center p-10">Etkinlikler yükleniyor...</div>;

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center">Tüm Etkinlikler</h1>

            {activities.length === 0 ? (
                <div className="text-center text-zinc-500">Henüz bir etkinlik bulunmamaktadır.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activities.map((activity) => (
                        <Card key={activity.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="text-sm text-blue-600 font-semibold mb-2">{activity.club?.name || "Kulüp"}</div>
                                <CardTitle className="text-xl">{activity.title}</CardTitle>
                                <div className="flex items-center text-zinc-500 text-sm mt-2">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {new Date(activity.activityDate).toLocaleDateString('tr-TR')}
                                    <Clock className="w-4 h-4 ml-3 mr-1" />
                                    {new Date(activity.activityDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-zinc-600 line-clamp-3">{activity.description}</p>
                            </CardContent>
                            <CardFooter>
                                <Link href={`/activities/${activity.id}`} className="w-full">
                                    <Button variant="outline" className="w-full">Detayları Gör</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
