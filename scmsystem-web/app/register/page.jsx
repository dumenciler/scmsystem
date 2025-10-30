// app/register/page.jsx
"use client"; // Bu satır önemli!

import { useState } from 'react';
import { handleRegister } from '../actions'; // Bunu bir sonraki adımda oluşturacağız
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    // Form verilerini tutmak için state'ler
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    
    const router = useRouter(); // Yönlendirme için

    // Form gönderildiğinde bu fonksiyon çalışacak
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Eski hataları temizle

        try {
            // Sunucu Eylemimizi (Server Action) çağırıyoruz
            const result = await handleRegister({ firstName, lastName, username, password });

            if (result.success) {
                // Kayıt başarılı, login sayfasına yönlendir
                alert('Kayıt başarılı! Lütfen giriş yapın.');
                router.push('/login');
            } else {
                // Backend'den gelen hatayı göster
                setError(result.message || 'Kayıt başarısız oldu.');
            }
        } catch (err) {
            setError('Bir sunucu hatası oluştu.');
        }
    };

    return (
        <div>
            <h2>Kayıt Ol</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Ad: </label>
                    <input 
                        type="text" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required 
                    />
                </div>
                <div>
                    <label>Soyad: </label>
                    <input 
                        type="text" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required 
                    />
                </div>
                <div>
                    <label>Username: </label>
                    <input 
                        type="username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required 
                    />
                </div>
                <div>
                    <label>Şifre: </label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                </div>
                
                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                <button type="submit">Kayıt Ol</button>
            </form>
        </div>
    );
}