"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Loader2, CheckCircle, XCircle, Clock, Calendar, Bookmark, Briefcase } from "lucide-react";
import { getActivitiesByClub, applyToActivity, getClubRegistrationsByUserId } from "../../actions";

export default function ClubDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const clubId = params.id;

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kullanıcının bu kulüple olan ilişkisi (null, PENDING, APPROVED, REJECTED)
  const [myStatus, setMyStatus] = useState(null);
  const [isJoining, setIsJoining] = useState(false);

  // Etkinlikler
  const [activities, setActivities] = useState([]);
  const [userApplications, setUserApplications] = useState([]);
  const [applyingActivityId, setApplyingActivityId] = useState(null);

  // Kullanıcı ID'sini al
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setCurrentUserId(u.id);
      } catch (e) { }
    }
  }, []);

  // 1. Verileri Çek
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // A) Kulüp Bilgisini Çek (Using fetch direct for consistency with existing or switch to action if implemented)
        // Existing used fetch, let's keep it or better use helper if available. 
        // Helper `getAllClubs` is available but returns list. 
        // Let's stick to existing fetch for Club details to check existing logic.
        const resClub = await fetch(`http://localhost:8082/rest/api/club/list`);
        if (resClub.ok) {
          const clubs = await resClub.json();
          const found = clubs.find(c => c.id == clubId);
          setClub(found);
        }

        // B) Başvuru Durumumu Kontrol Et
        if (currentUserId) {
          const resRegs = await fetch(`http://localhost:8082/rest/api/club-registration/list/${clubId}`);
          if (resRegs.ok) {
            const regs = await resRegs.json();
            const myRegistration = regs.find(r => r.userId === currentUserId);
            if (myRegistration) {
              setMyStatus(myRegistration.status);
            }
          }
        }

        // C) Etkinlikleri Çek
        const activitiesRes = await getActivitiesByClub(clubId);
        if (activitiesRes.success) {
          setActivities(activitiesRes.data);
        }

        // D) Kullanıcının etkinliklere başvurularını çek (My Applications)
        if (currentUserId) {
          // We need an endpoint for checking 'am I applied to this activity?' 
          // Currently backend has `getApplicationsByUser`.
          const resApps = await fetch(`http://localhost:8082/rest/api/activity/my-applications/${currentUserId}`);
          if (resApps.ok) {
            const apps = await resApps.json();
            setUserApplications(apps);
          }
        }

      } catch (error) {
        console.error("Veri çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    if (clubId) {
      fetchData();
    }
  }, [clubId, currentUserId]);

  const handleJoinClub = async () => {
    setIsJoining(true);
    try {
      const res = await fetch(
        `http://localhost:8082/rest/api/club-registration/apply?userId=${currentUserId}&clubId=${clubId}`,
        { method: "POST" }
      );

      if (res.ok) {
        setMyStatus("PENDING");
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

  const handleApplyActivity = async (activityId) => {
    if (!currentUserId) {
      alert("Lütfen önce giriş yapın.");
      return;
    }
    setApplyingActivityId(activityId);
    const res = await applyToActivity(currentUserId, activityId);
    if (res.success) {
      alert(res.message);
      // Refresh applications
      const resApps = await fetch(`http://localhost:8082/rest/api/activity/my-applications/${currentUserId}`);
      if (resApps.ok) {
        const apps = await resApps.json();
        setUserApplications(apps);
      }
    } else {
      alert(res.message);
    }
    setApplyingActivityId(null);
  }

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
    return (
      <Button
        onClick={handleJoinClub}
        size="lg"
        disabled={isJoining}
        className="w-full md:w-auto px-8 py-6 text-lg bg-blue-900 hover:bg-blue-800 text-white transition-all"
      >
        {isJoining ? (
          <> <Loader2 className="w-5 h-5 mr-2 animate-spin" /> İşleniyor... </>
        ) : (
          "Kulübe Katıl 🚀"
        )}
      </Button>
    );
  };

  // Filter Activities
  // const now = new Date(); // Removed date check as per user request
  const activeActivities = activities.filter(a => a.active);

  const pastActivities = activities.filter(a => !a.active);

  return (
    <div className="container mx-auto py-10 px-4">

      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Listeye Geri Dön
      </Button>

      <Card className="max-w-4xl mx-auto shadow-lg bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 mb-10">
        <CardHeader className="text-center border-b border-zinc-100 dark:border-zinc-800 pb-6">
          {club?.logoLink ? (
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
          <CardTitle className="text-3xl font-bold text-zinc-900 dark:text-white">{club?.name}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-8 pt-6">
          <div className="text-lg text-center text-zinc-600 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-lg">
            {club?.description || "Bu kulüp için henüz bir açıklama girilmemiş."}
          </div>

          <div className="flex justify-center pt-2">
            {renderActionButton()}
          </div>
        </CardContent>
      </Card>

      {/* --- Active Activities --- */}
      <h2 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-zinc-100 flex items-center">
        <Calendar className="mr-2" /> Aktif Etkinlikler
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {activeActivities.length === 0 ? (
          <p className="text-zinc-500">Şu anda aktif etkinlik bulunmamaktadır.</p>
        ) : (
          activeActivities.map(activity => {
            const isApplied = userApplications.some(app => app.activity.id === activity.id);
            const isMember = myStatus === 'APPROVED';

            return (
              <Card key={activity.id} className="border-l-4 border-l-blue-600 shadow-md">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>{activity.title}</span>
                    {isApplied && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Başvuruldu</span>}
                  </CardTitle>
                  <div className="text-sm text-zinc-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {new Date(activity.activityDate).toLocaleString('tr-TR')}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-700 dark:text-zinc-300">{activity.description}</p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={!isMember || isApplied || applyingActivityId === activity.id}
                    onClick={() => handleApplyActivity(activity.id)}
                  >
                    {isApplied ? "Başvuru Yapıldı" : (!isMember ? "Sadece Üyeler Katılabilir" : "Başvur")}
                  </Button>
                </CardFooter>
              </Card>
            )
          })
        )}
      </div>

      {/* --- Past Activities --- */}
      <h2 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-zinc-100 flex items-center opacity-80">
        <Bookmark className="mr-2" /> Geçmiş Etkinlikler
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-75 grayscale-[50%]">
        {pastActivities.length === 0 ? (
          <p className="text-zinc-500">Geçmiş etkinlik bulunmamaktadır.</p>
        ) : (
          pastActivities.map(activity => (
            <Card key={activity.id} className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200">
              <CardHeader>
                <CardTitle>{activity.title}</CardTitle>
                <div className="text-sm text-zinc-500 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" /> {new Date(activity.activityDate).toLocaleString('tr-TR')}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">{activity.description}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

    </div>
  );
}
