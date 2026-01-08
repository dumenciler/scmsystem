const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8082").replace(/\/+$/, "");

export async function handleRegister({ firstName, lastName, email, username, password }) {
  try {
    const res = await fetch(`${API_BASE}/rest/api/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, username, password }),
    });
    const data = await res.json().catch(() => ({}));

    const ok = res.ok && (data?.id || /success/i.test(String(data?.message || "")));
    return { success: !!ok, message: data?.message || (ok ? "OK" : "Kayıt başarısız"), data };
  } catch {
    return { success: false, message: "Sunucuya bağlanılamadı." };
  }
}

export async function handleLogin({ email, password }) {
  try {
    const res = await fetch(`${API_BASE}/rest/api/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));

    const ok = res.ok && (data?.id || /success/i.test(String(data?.message || "")));
    if (ok) {
      // Just return true/data here, let component handle redirect
    }
    return { success: !!ok, message: data?.message || (ok ? "OK" : "Giriş başarısız"), data };
  } catch {
    return { success: false, message: "Sunucuya bağlanılamadı." };
  }
}

export async function forgotPassword(email) {
  try {
    const res = await fetch(`${API_BASE}/rest/api/user/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    return { success: res.ok, message: data?.message || "İşlem başarısız", data };
  } catch {
    return { success: false, message: "Sunucu hatası." };
  }
}

export async function resetPassword(token, newPassword) {
  try {
    const res = await fetch(`${API_BASE}/rest/api/user/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });
    const data = await res.json().catch(() => ({}));
    return { success: res.ok && /success/i.test(String(data?.message || "")), message: data?.message || "İşlem başarısız" };
  } catch {
    return { success: false, message: "Sunucu hatası." };
  }
}

export async function createClub(clubData) {
  try {
    const res = await fetch(`${API_BASE}/rest/api/club/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clubData),
    });

    // Backend returns the created object directly, not a {message: ...} wrapper on success usually?
    // Checking Controller: returns DtoClub. So if it has ID, it's success.

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      if (data && data.id) {
        return { success: true, message: "Kulüp başarıyla oluşturuldu." };
      }
    }

    // If not ok, try to parse error
    const errData = await res.json().catch(() => ({}));
    return { success: false, message: errData?.message || "Kulüp oluşturulamadı." };
  } catch {
    return { success: false, message: "Sunucu hatası." };
  }
}

export async function getAllClubs() {
  try {
    const res = await fetch(`${API_BASE}/rest/api/club/list`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json().catch(() => ([]));
    return { success: res.ok, data: Array.isArray(data) ? data : [] };
  } catch {
    return { success: false, data: [] };
  }
}

export async function getUserById(id) {
  try {
    const res = await fetch(`${API_BASE}/rest/api/user/list/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function updateUser(id, userData) {
  // userData: { firstName, lastName, username, password (yeni), currentPassword }
  try {
    const res = await fetch(`${API_BASE}/rest/api/user/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (res.ok) {
      return { success: true, message: "Profil güncellendi", data };
    } else {
      return { success: false, message: data.message || "Güncelleme başarısız." };
    }
  } catch (error) {
    return { success: false, message: "Sunucu hatası." };
  }
}

// --- ACTIVITY SERVICES ---

export async function createActivity(activityData) {
  try {
    const res = await fetch(`${API_BASE}/rest/api/activity/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activityData),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.id) {
      return { success: true, message: "Etkinlik başarıyla oluşturuldu.", data };
    }
    return { success: false, message: "Etkinlik oluşturulamadı." };
  } catch {
    return { success: false, message: "Sunucu hatası." };
  }
}

export async function getAllActivities() {
  try {
    const res = await fetch(`${API_BASE}/rest/api/activity/list`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json().catch(() => ([]));
    return { success: res.ok, data: Array.isArray(data) ? data : [] };
  } catch {
    return { success: false, data: [] };
  }
}

export async function getActivitiesByClub(clubId) {
  try {
    const res = await fetch(`${API_BASE}/rest/api/activity/list/${clubId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json().catch(() => ([]));
    return { success: res.ok, data: Array.isArray(data) ? data : [] };
  } catch {
    return { success: false, data: [] };
  }
}

export async function getActivityById(id) {
  try {
    const res = await fetch(`${API_BASE}/rest/api/activity/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return null;
    return data;
  } catch {
    return null;
  }
}

export async function applyToActivity(userId, activityId) {
  try {
    const res = await fetch(`${API_BASE}/rest/api/activity/apply?userId=${userId}&activityId=${activityId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.id) {
      return { success: true, message: "Başvuru başarılı.", data };
    }
    return { success: false, message: data.message || "Başvuru başarısız." };
  } catch {
    return { success: false, message: "Sunucu hatası." };
  }
}

export async function getClubRegistrationsByUserId(userId) {
  try {
    const res = await fetch(`${API_BASE}/rest/api/club-registration/my-registrations/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json().catch(() => ([]));
    return { success: res.ok, data: Array.isArray(data) ? data : [] };
  } catch {
    return { success: false, data: [] };
  }
}
