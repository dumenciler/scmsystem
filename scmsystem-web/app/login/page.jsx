// app/login/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleLogin } from "../actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await handleLogin({ username, password }); 
      if (result.success) {
        router.push("/home"); 
      } else {
        setError(result.message || "Giriş başarısız oldu.");
      }
    } catch {
      setError("Giriş yapılırken bir sunucu hatası oluştu.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl">Giriş Yap</CardTitle>
            <CardDescription>Devam etmek için kullanıcı adı ve şifreni gir.</CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full">Giriş Yap</Button>
            <p className="text-xs text-center text-gray-500">
              Hesabın yok mu? <a href="/register" className="font-semibold underline">Kayıt Ol</a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
