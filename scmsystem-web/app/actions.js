// app/actions.js
"use server"; // Bu bir Sunucu Eylemidir!

export async function handleRegister(formData) {
    
    // BURAYI GÜNCELLE: Kendi Spring Boot API adresinizi yazın
    const API_URL = 'http://localhost:8080/api/auth/register'; 

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Formdan gelen 'firstName', 'lastName' vb. veriyi JSON'a çeviriyoruz
            body: JSON.stringify(formData), 
        });

        // Backend'den gelen yanıtı JSON olarak oku
        const data = await response.json();

        if (!response.ok) {
            // Eğer backend 400, 500 gibi bir hata döndürürse
            // (örn: "Bu email zaten kullanılıyor")
            return { success: false, message: data.message || 'Hata oluştu' };
        }

        // Başarılı
        return { success: true, data: data };

    } catch (error) {
        // fetch hatası veya sunucuya ulaşılamaması durumu
        console.error('Register hatası:', error);
        return { success: false, message: 'Sunucuya bağlanılamadı.' };
    }
}

// ----- LOGIN İŞLEMİ (BONUS) -----
// Login için de benzer bir fonksiyon oluşturabilirsiniz
export async function handleLogin(formData) {
    // BURAYI GÜNCELLE: Kendi login API adresinizi yazın
    const API_URL = 'http://localhost:8080/api/auth/login'; 

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData), // { email, password }
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || 'Giriş başarısız' };
        }

        // Genellikle backend bir "token" döner, bunu burada işleyebilirsiniz
        return { success: true, data: data }; 

    } catch (error) {
        return { success: false, message: 'Sunucuya bağlanılamadı.' };
    }
}