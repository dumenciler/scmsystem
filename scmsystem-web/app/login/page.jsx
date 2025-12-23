"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleLogin } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { School, User, Lock, Loader2, LogIn, Mail } from "lucide-react"; // İkonlar kütüphaneden

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!email.includes("@")) {
        setError("Lütfen geçerli bir e-posta adresi giriniz");
        setLoading(false);
        return;
      }
      const result = await handleLogin({ email, password });

      if (result.success) {
        // Save auth data
        localStorage.setItem("user", JSON.stringify(result.data)); // Stores ID, Name, Role

        setMessage("Giriş başarılı! Yönlendiriliyorsunuz...");
        // Check role and redirect
        if (result.data?.role === 'ADMIN') {
          router.push("/admin");
        } else {
          router.push("/home");
        }
      } else {
        setError(result.message || "Giriş başarısız oldu.");
      }
    } catch (err) {
      console.error(err);
      setError("Sunucu hatası oluştu: " + (err.message || "Bilinmeyen hata"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-6">

        {/* Logo ve Başlık */}
        <div className="text-center space-y-2">
          <div className="mx-auto bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 ring-8 ring-blue-50/50 dark:ring-blue-900/10">
            <School className="w-8 h-8 text-blue-900 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-blue-950 dark:text-white">Giriş Yap</h1>
          <p className="text-sm text-zinc-500">SCM Sistemine erişmek için bilgilerinizi girin.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
              <Input
                id="email"
                type="email"
                className="pl-10 h-11 bg-zinc-50/50 border-zinc-200 focus:border-blue-900 focus:ring-blue-900"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                className="pl-10 h-11 bg-zinc-50/50 border-zinc-200 focus:border-blue-900 focus:ring-blue-900"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {message && (
            <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg flex items-center gap-2">
              <span>✅</span> {message}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <Button type="submit" className="w-full h-11 bg-blue-900 hover:bg-blue-800 text-white" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </Button>
        </form>

        <div className="text-center text-sm space-y-2">
          <div>
            <a href="/forgot-password" className="text-blue-900 hover:underline text-xs">Şifremi unuttum</a>
          </div>
          <div>
            <span className="text-zinc-500">Hesabınız yok mu? </span>
            <a href="/register" className="font-semibold text-blue-900 hover:underline">Kayıt Ol</a>
          </div>
        </div>
      </div>
    </main>
  );
}