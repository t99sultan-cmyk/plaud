import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Вход — VoiceApp" };

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Войти</CardTitle>
        <CardDescription>Транскрипция, саммари и Q&A для твоих записей.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </CardContent>
    </Card>
  );
}
