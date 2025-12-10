"use client";

import { useState } from "react";
import { forgotPassword } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, KeyRound } from "lucide-react";
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        setLoading(true);

        try {
            const result = await forgotPassword(email);
            if (result.success) {

                setMessage(result.message || "Şifre sıfırlama bağlantısı e-postanıza gönderildi.");
            } else {
                setError(result.message || "İşlem başarısız.");
            }
        } catch {
            setError("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-6">

                <div className="text-center space-y-2">
                    <div className="mx-auto bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 ring-8 ring-blue-50/50 dark:ring-blue-900/10">
                        <KeyRound className="w-8 h-8 text-blue-900 dark:text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-blue-950 dark:text-white">Şifremi Unuttum</h1>
                    <p className="text-sm text-zinc-500">E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">E-posta</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                            <Input
                                id="email"
                                type="email"
                                className="pl-10 h-11 bg-zinc-50/50"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {message && (
                        <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full h-11 bg-blue-900 hover:bg-blue-800 text-white" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {loading ? "Gönderiliyor..." : "Gönder"}
                    </Button>
                </form>

                <div className="text-center text-sm">
                    <Link href="/login" className="font-semibold text-blue-900 hover:underline">
                        Giriş ekranına dön
                    </Link>
                </div>
            </div>
        </main>
    );
}
