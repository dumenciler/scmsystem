"use client";

import { Calendar, MapPin, Building2, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export function EventCard({ activity }) {
    if (!activity) return null;

    const formattedDate = activity.activityDate
        ? format(new Date(activity.activityDate), "d MMMM yyyy HH:mm", { locale: tr })
        : "Tarih belirtilmemiş";

    return (
        <div className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-800">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400">
                        <Building2 className="h-3 w-3" />
                        <span>{activity.club?.name || "Kulüp"}</span>
                    </div>

                    <h3 className="text-lg font-bold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                        {activity.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            <span>{formattedDate}</span>
                        </div>
                        {activity.place && (
                            <div className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                <span>{activity.place || "Yer belirtilmemiş"}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="shrink-0">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full gap-2 sm:w-auto"
                        onClick={() => window.location.href = `/activities/${activity.id}`}
                    >
                        İncele
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Decorative gradient */}
            <div className="absolute inset-x-0 bottom-0 h-1 scale-x-0 bg-gradient-to-r from-blue-500 to-indigo-500 transition-transform duration-300 group-hover:scale-x-100" />
        </div>
    );
}
