// app/register/page.jsx
"use client"; 

import { useState } from 'react';
import { handleRegister } from '../actions'; 
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
    
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    
    const router = useRouter(); 

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); 

        try {
            
            const result = await handleRegister({ firstName, lastName, username, password });

            if (result.success) {
                
                alert('Kayıt başarılı! Lütfen giriş yapın.');
                router.push('/login');
            } else {
                
                setError(result.message || 'Kayıt başarısız oldu.');
            }
        } catch (err) {
            setError('Bir sunucu hatası oluştu.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">

            <Card className="w-full max-w-sm">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle className="text-2xl">Kayıt Ol</CardTitle>
                        <CardDescription>
                            Devam etmek için bilgilerinizi girin.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                type="firstName"
                                placeholder=""
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                type="lastName"
                                placeholder=""
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="username"
                                placeholder=""
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder=""
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full">
                            Kayıt Ol
                        </Button>
                        <p className="text-xs text-center text-gray-500">
                            Hesabın var mı? 
                            <a href="/login" className="font-semibold underline">
                                Giriş Yap
                            </a>
                        </p>
                    </CardFooter>
                    
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    
                    
                </form>
            </Card>
        </div>
    );
}