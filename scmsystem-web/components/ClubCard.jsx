"use client";

import Link from "next/link";
import { Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClubCard({ club }) {
    if (!club) return null;

    return (
        <div className="group bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-all hover:border-blue-500/50 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center overflow-hidden">
                    {club.logoLink ? (
                        <img
                            src={club.logoLink}
                            alt={club.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.nextSibling.style.display = "flex";
                            }}
                        />
                    ) : null}
                    <Users className={`w-6 h-6 text-blue-600 dark:text-blue-400 ${club.logoLink ? 'hidden' : 'flex'}`} />
                </div>
            </div>

            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 line-clamp-1" title={club.name}>
                {club.name}
            </h2>

            <p className="text-zinc-500 text-sm mb-4 line-clamp-3 bg-red-100/0 flex-grow">
                {club.description || "Açıklama bulunmuyor."}
            </p>

            <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
                {/* BURASI DÜZELTİLDİ: Artık Detay sayfasına gidiyor */}
                <Link href={`/clubs/${club.id}`} className="w-full block">
                    <Button
                        variant="outline"
                        className="w-full text-xs h-9"
                    >
                        <ExternalLink className="w-3 h-3 mr-2" />
                        Detaylar
                    </Button>
                </Link>
            </div>
        </div>
    );
}