"use client";

import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation"; // Önizleme ortamında hata verdiği için kapatıldı
import { Button } from "@/components/ui/button";
import { School, UserCircle, LogOut } from "lucide-react";

export default function HomePage() {
  // const router = useRouter(); // Next.js yönlendiricisi yerine window.location kullanılacak
  const [userName, setUserName] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    // router.push("/"); 
    window.location.href = "/"; // Önizleme için standart yönlendirme
  };

  const goToProfile = () => {
    // router.push("/profile");
    window.location.href = "/profile"; // Önizleme için standart yönlendirme
  };

  if (!mounted) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
      
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-8 text-center space-y-6">
        
        <div className="mx-auto bg-blue-50 dark:bg-blue-900/20 w-20 h-20 rounded-full flex items-center justify-center mb-4 ring-8 ring-blue-50/50 dark:ring-blue-900/10">
           <School className="w-10 h-10 text-blue-900 dark:text-blue-400" />
        </div>

        <div className="space-y-2">
            <h1 className="text-2xl font-bold text-blue-950 dark:text-white">
                {userName ? `Hoşgeldin, ${userName}!` : "Hoşgeldiniz"}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                YTÜ Öğrenci Kulüpleri Yönetim Sistemi'ne başarıyla giriş yaptınız.
            </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-lg p-4 text-sm text-yellow-800 dark:text-yellow-500">
            <p className="font-medium">🚧 Yapım Aşamasında</p>
            <p className="mt-1 opacity-90">Kulüp etkinlikleri ve üyelik işlemleri çok yakında hizmetinizde olacak.</p>
        </div>

        <div className="grid gap-3 pt-2">
            <Button 
                onClick={goToProfile} 
                className="w-full bg-blue-900 hover:bg-blue-800 text-white h-11 shadow-md shadow-blue-900/10"
            >
                <UserCircle className="w-5 h-5 mr-2" />
                Profilime Git
            </Button>
            
            <Button 
                variant="outline" 
                onClick={handleLogout} 
                className="w-full border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-red-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
                <LogOut className="w-4 h-4 mr-2" />
                Çıkış Yap
            </Button>
        </div>
      </div>

      <footer className="mt-8 text-xs text-zinc-400 text-center">
        &copy; 2024 Yıldız Teknik Üniversitesi Öğrenci Dekanlığı
      </footer>

    </main>
  );
}