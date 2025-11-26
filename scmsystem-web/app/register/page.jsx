"use client";

import { useState } from 'react';
import { handleRegister } from '../actions';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { School, User, Lock, UserPlus, Loader2 } from "lucide-react";

export default function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const router = useRouter(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); 
        setLoading(true);

        try {
            const result = await handleRegister({ firstName, lastName, username, password });
            if (result.success) {
                alert('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.');
                router.push('/login');
            } else {
                setError(result.message || 'Kayıt başarısız oldu.');
            }
        } catch (err) {
            setError('Bir sunucu hatası oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-6">
                
                <div className="text-center space-y-2">
                    <div className="mx-auto bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 ring-8 ring-blue-50/50 dark:ring-blue-900/10">
                        <School className="w-8 h-8 text-blue-900 dark:text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-blue-950 dark:text-white">Kayıt Ol</h1>
                    <p className="text-sm text-zinc-500">Yeni bir hesap oluşturarak aramıza katılın.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Ad</Label>
                            <Input 
                                id="firstName" 
                                className="h-11 bg-zinc-50/50"
                                value={firstName} 
                                onChange={(e) => setFirstName(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Soyad</Label>
                            <Input 
                                id="lastName" 
                                className="h-11 bg-zinc-50/50"
                                value={lastName} 
                                onChange={(e) => setLastName(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="username">Kullanıcı Adı</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                            <Input 
                                id="username" 
                                className="pl-10 h-11 bg-zinc-50/50"
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Şifre</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                            <Input 
                                id="password" 
                                type="password" 
                                className="pl-10 h-11 bg-zinc-50/50"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}

                    <Button type="submit" className="w-full h-11 bg-blue-900 hover:bg-blue-800 text-white" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                        {loading ? "Kaydediliyor..." : "Kayıt Ol"}
                    </Button>
                </form>

                <div className="text-center text-sm">
                    <span className="text-zinc-500">Zaten hesabınız var mı? </span>
                    <a href="/login" className="font-semibold text-blue-900 hover:underline">Giriş Yap</a>
                </div>
            </div>
        </main>
    );
}