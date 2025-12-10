"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClub } from "../../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Loader2, Link as LinkIcon, Building2 } from "lucide-react";
import Link from 'next/link';

export default function CreateClubPage() {
    const router = useRouter();

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            router.push("/login");
            return;
        }
        try {
            const user = JSON.parse(userStr);
            if (user.role !== 'ADMIN') {
                router.push("/login");
            }
        } catch (e) {
            router.push("/login");
        }
    }, [router]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        logoLink: ""
    });
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (!formData.name.trim()) {
            setError("Kulüp adı boş olamaz.");
            return;
        }

        setLoading(true);

        try {
            const result = await createClub(formData);
            if (result.success) {
                setMessage(result.message);
                setFormData({ name: "", description: "", logoLink: "" }); // Reset form
            } else {
                setError(result.message);
            }
        } catch {
            setError("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="p-8 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center space-x-3 mb-1">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                            <Building2 className="w-6 h-6 text-blue-700 dark:text-blue-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Yeni Kulüp Ekle</h1>
                    </div>
                    <p className="text-zinc-500 ml-11">Kulüp bilgilerini girerek sisteme kaydedin.</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Club Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Kulüp Adı <span className="text-red-500">*</span></Label>
                            <Input
                                id="name"
                                placeholder="Örn: Board of European Students of Technology Istanbul Yildiz"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Açıklama</Label>
                            <Textarea
                                id="description"
                                placeholder="Kulüp hakkında kısa bir açıklama(maksimum 255 karakter)..."
                                className="min-h-[100px]"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Logo Link */}
                        <div className="space-y-2">
                            <Label htmlFor="logoLink">Logo Bağlantısı (URL)</Label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                                <Input
                                    id="logoLink"
                                    placeholder="https://example.com/logo.png"
                                    className="pl-10"
                                    value={formData.logoLink}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>


                        {message && (
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl border border-green-200 dark:border-green-900 flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-900 flex items-center">
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                {error}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-4 pt-4">
                            <Link href="/admin" className="flex-1">
                                <Button variant="outline" type="button" className="w-full h-12">
                                    Geri
                                </Button>
                            </Link>
                            <Button type="submit" className="flex-1 h-12 bg-blue-900 hover:bg-blue-800 text-white" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                                {loading ? "Ekleniyor..." : "Ekle"}
                            </Button>
                        </div>

                    </form>
                </div>
            </div>
        </main>
    );
}
