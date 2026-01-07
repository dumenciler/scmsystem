"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, CheckCircle, XCircle, Clock } from "lucide-react";

export default function ClubDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const clubId = params.id;

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Kullanıcının bu kulüple olan ilişkisi (null, PENDING, APPROVED, REJECTED)
  const [myStatus, setMyStatus] = useState(null); 
  const [isJoining, setIsJoining] = useState(false);

  // Kullanıcı ID'sini al
  const [currentUserId, setCurrentUserId] = useState(1);

  useEffect(() => {
     const userStr = localStorage.getItem("user");
     if(userStr) {
         try {
             const u = JSON.parse(userStr);
             setCurrentUserId(u.id);
         } catch(e) {}
     }
  }, []);

  // 1. Kulüp Detaylarını ve Benim Durumumu Getir
  useEffect(() => {
    const fetchData = async () => {
      try {
        // A) Kulüp Bilgisini Çek
        const resClub = await fetch(`http://localhost:8082/rest/api/club/list`);
        if (resClub.ok) {
            const clubs = await resClub.json();
            const found = clubs.find(c => c.id == clubId);
            setClub(found);
        }

        // B) Başvuru Durumumu Kontrol Et
        // (Mevcut 'list' servisini kullanarak benim başvurum var mı bakıyoruz)
        const resRegs = await fetch(`http://localhost:8082/rest/api/club-registration/list/${clubId}`);
        if (resRegs.ok) {
            const regs = await resRegs.json();
            // Benim ID'me ait bir kayıt var mı?
            const myRegistration = regs.find(r => r.userId === currentUserId);
            if (myRegistration) {
                setMyStatus(myRegistration.status); // PENDING, APPROVED, REJECTED
            }
        }

      } catch (error) {
        console.error("Veri çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    if (clubId && currentUserId) {
      fetchData();
    }
  }, [clubId, currentUserId]);

  // 2. Kulübe Katılma Fonksiyonu
  const handleJoinClub = async () => {
    setIsJoining(true);
    try {
      const res = await fetch(
        `http://localhost:8082/rest/api/club-registration/apply?userId=${currentUserId}&clubId=${clubId}`,
        { method: "POST" }
      );

      if (res.ok) {
        setMyStatus("PENDING"); // Anında arayüzü güncelle
        alert("Başvurunuz başarıyla alındı! 🎉 Yöneticinin onayı bekleniyor.");
      } else {
        const errorText = await res.text();
        alert("İşlem başarısız: " + errorText);
      }
    } catch (error) {
      console.error("Başvuru hatası:", error);
      alert("Bir bağlantı hatası oluştu.");
    } finally {
      setIsJoining(false);
    }
  };

  // --- Buton Durumunu Belirleyen Yardımcı Fonksiyon ---
  const renderActionButton = () => {
      if (myStatus === 'APPROVED') {
          return (
              <Button disabled className="w-full md:w-auto px-8 py-6 text-lg bg-green-600 opacity-90 text-white cursor-not-allowed">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Zaten Üyesiniz
              </Button>
          );
      }
      
      if (myStatus === 'REJECTED') {
          return (
              <Button disabled variant="destructive" className="w-full md:w-auto px-8 py-6 text-lg cursor-not-allowed">
                  <XCircle className="w-5 h-5 mr-2" />
                  Başvurunuz Reddedildi
              </Button>
          );
      }

      if (myStatus === 'PENDING') {
          return (
              <Button disabled className="w-full md:w-auto px-8 py-6 text-lg bg-yellow-500/80 text-white cursor-not-allowed">
                  <Clock className="w-5 h-5 mr-2" />
                  İstek Gönderildi
              </Button>
          );
      }

      // Hiçbir kaydı yoksa (null)
      return (
        <Button 
            onClick={handleJoinClub} 
            size="lg"
            disabled={isJoining}
            className="w-full md:w-auto px-8 py-6 text-lg bg-blue-900 hover:bg-blue-800 text-white transition-all"
        >
          {isJoining ? (
              <> <Loader2 className="w-5 h-5 mr-2 animate-spin"/> İşleniyor... </>
          ) : (
              "Kulübe Katıl 🚀"
          )}
        </Button>
      );
  };

  if (loading) return <div className="p-10 text-center flex justify-center"><Loader2 className="animate-spin mr-2"/> Yükleniyor...</div>;
  if (!club) return <div className="p-10 text-center">Kulüp bulunamadı :(</div>;

  return (
    <div className="container mx-auto py-10 px-4">
      
      {/* Geri Dön Butonu */}
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="mb-6 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Listeye Geri Dön
      </Button>

      <Card className="max-w-2xl mx-auto shadow-lg bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <CardHeader className="text-center border-b border-zinc-100 dark:border-zinc-800 pb-6">
            {club.logoLink ? (
                <img 
                  src={club.logoLink} 
                  alt={club.name} 
                  className="w-32 h-32 mx-auto object-cover mb-4 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm"
                />
            ) : (
                <div className="w-32 h-32 mx-auto bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-4 text-4xl">
                    🏫
                </div>
            )}
          <CardTitle className="text-3xl font-bold text-zinc-900 dark:text-white">{club.name}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-8 pt-6">
          <div className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-lg">
            {club.description || "Bu kulüp için henüz bir açıklama girilmemiş."}
          </div>

          <div className="flex justify-center pt-2">
            {renderActionButton()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}