const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080").replace(/\/+$/, "");

export async function handleRegister({ firstName, lastName, username, password }) {
  try {
    const res = await fetch(`${API_BASE}/rest/api/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, username, password }),
    });
    const data = await res.json().catch(() => ({}));

    const ok = res.ok && (data?.id || /success/i.test(String(data?.message || "")));
    return { success: !!ok, message: data?.message || (ok ? "OK" : "Kayıt başarısız"), data };
  } catch {
    return { success: false, message: "Sunucuya bağlanılamadı." };
  }
}

export async function handleLogin({ username, password }) {
  try {
    const res = await fetch(`${API_BASE}/rest/api/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json().catch(() => ({}));

    const ok = res.ok && (data?.id || /success/i.test(String(data?.message || "")));
    return { success: !!ok, message: data?.message || (ok ? "OK" : "Giriş başarısız"), data };
  } catch {
    return { success: false, message: "Sunucuya bağlanılamadı." };
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