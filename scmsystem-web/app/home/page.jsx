"use client";

import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation"; // Önizleme ortamında hata verdiği için kapatıldı
import { Button } from "@/components/ui/button";
import { School, UserCircle, LogOut } from "lucide-react";
import { getAllClubs } from "../actions";
import { ClubCard } from "@/components/ClubCard";

export default function HomePage() {
  // const router = useRouter(); // Next.js yönlendiricisi yerine window.location kullanılacak
  const [userName, setUserName] = useState("");
  const [mounted, setMounted] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    const result = await getAllClubs();
    if (result.success) {
      setClubs(result.data);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    // router.push("/"); 
    window.location.href = "/";
  };

  const goToProfile = () => {
    // router.push("/profile");
    window.location.href = "/profile";
  };

  if (!mounted) return null;

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Header / Navbar-like user info */}
      <div className="w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
              <School className="w-6 h-6 text-blue-900 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-blue-950 dark:text-white leading-tight">
                SCM Sistemi
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {userName ? `Hoşgeldin, ${userName}` : "Öğrenci Kulüpleri"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToProfile}
              title="Profil"
              className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-blue-900 dark:hover:text-blue-400"
            >
              <UserCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Profilim</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Çıkış"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-8">

        {/* Intro Section */}
        <section className="text-center py-8 space-y-4">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Kulüpleri Keşfet</h2>
          <p className="text-zinc-500 max-w-2xl mx-auto">
            Üniversitemizdeki tüm aktif kulüpleri buradan inceleyebilirsiniz.
            İlginizi çeken kulüplerin detaylarına göz atın.
          </p>
        </section>

        {/* Clubs Grid */}
        <section>
          {loading ? (
            <div className="text-center py-20 text-zinc-400">Yükleniyor...</div>
          ) : clubs.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-500">Henüz hiç kulüp bulunmuyor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {clubs.map(club => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          )}
        </section>


      </div>

      <footer className="mt-auto py-6 text-xs text-zinc-400 text-center border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        &copy; 2025 Yıldız Teknik Üniversitesi Öğrenci Dekanlığı
      </footer>

    </main>
  );
}