"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserById, updateUser } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCircle, Save, LogOut, ArrowLeft, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userId, setUserId] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",        // Yeni şifre
    currentPassword: ""  // Mevcut şifre (Doğrulama için)
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        router.push("/login");
        return;
      }
      try {
        const user = JSON.parse(userStr);
        if (user && user.id) {
          setUserId(user.id);
          fetchUserData(user.id);
        } else {
          router.push("/login");
        }
      } catch (e) {
        router.push("/login");
      }
    }
  }, [router]);

  const fetchUserData = async (id) => {
    try {
      const data = await getUserById(id);
      if (data) {
        setFormData(prev => ({
          ...prev,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          username: data.username || "",
          email: data.email || "",
        }));
      } else {
        setMessage({ text: "Kullanıcı bilgileri alınamadı.", type: "error" });
      }
    } catch {
      setMessage({ text: "Sunucu hatası.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    // Şifre değişikliği kontrolü
    if (formData.password && !formData.currentPassword) {
      setMessage({ text: "Şifrenizi değiştirmek için mevcut şifrenizi girmelisiniz.", type: "error" });
      return;
    }

    setUpdating(true);

    try {
      const result = await updateUser(userId, formData);

      if (result.success) {
        setMessage({ text: "Profil başarıyla güncellendi!", type: "success" });
        localStorage.setItem("userName", formData.firstName);
        setFormData(prev => ({ ...prev, password: "", currentPassword: "" }));
      } else {
        setMessage({ text: result.message || "Güncelleme başarısız. Mevcut şifrenizi kontrol edin.", type: "error" });
      }
    } catch {
      setMessage({ text: "Bir hata oluştu.", type: "error" });
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50">
        <Loader2 className="w-8 h-8 text-blue-900 animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8 space-y-6">

        <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-full">
              <UserCircle className="w-6 h-6 text-blue-900" />
            </div>
            <h1 className="text-xl font-bold text-blue-950 dark:text-white">Profilim</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.push('/home')} className="text-zinc-500 hover:text-blue-900">
            <ArrowLeft className="w-4 h-4 mr-1" /> Geri
          </Button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Ad</Label>
              <Input
                id="firstName"
                className="h-11 bg-zinc-50/50"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Soyad</Label>
              <Input
                id="lastName"
                className="h-11 bg-zinc-50/50"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Kullanıcı Adı</Label>
            <Input
              id="username"
              className="h-11 bg-zinc-50/50"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-posta Adresi</Label>
            <Input
              id="email"
              type="email"
              className="h-11 bg-zinc-50/50"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="pt-4 border-t border-zinc-100 mt-4">
            <h3 className="text-sm font-medium text-zinc-900 mb-3">Şifre Değiştir</h3>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  className="h-11 bg-zinc-50/50"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  placeholder="Şifre veya e-posta değiştirmek için zorunlu"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Yeni Şifre</Label>
                <Input
                  id="password"
                  type="password"
                  className="h-11 bg-zinc-50/50"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="İsteğe bağlı"
                />
              </div>
            </div>
          </div>

          {message.text && (
            <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.type === 'success' ? '✅' : '⚠️'} {message.text}
            </div>
          )}

          <div className="pt-2 space-y-3">
            <Button type="submit" className="w-full h-11 bg-blue-900 hover:bg-blue-800 text-white" disabled={updating}>
              {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Değişiklikleri Kaydet
            </Button>

            <Button variant="outline" type="button" className="w-full h-11 border-zinc-200 text-red-600 hover:bg-red-50" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Çıkış Yap
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}