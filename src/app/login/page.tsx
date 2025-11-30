
'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

enum ModeEnum {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  RESET = 'RESET',
}

function LoginPageContent() {
  const [mode, setMode] = useState<ModeEnum>(ModeEnum.LOGIN);
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSuccess = () => {
    const redirectTo = searchParams.get('redirect') || '/inicio';
    router.replace(redirectTo);
  };

  const handleRegisterSuccess = () => {
    setMode(ModeEnum.LOGIN);
  };

  const switchMode = (newMode: ModeEnum) => {
    setMode(newMode);
  };

  const handleForgotPassword = () => {
    setMode(ModeEnum.RESET);
  };

  const handleResetSuccess = () => {
    setMode(ModeEnum.LOGIN);
  };

  const handleBackToForgot = () => {
    setMode(ModeEnum.LOGIN);
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden bg-gradient-to-br from-[#8B4513]/10 via-background to-[#6B3410]/10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(139,69,19,0.9) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <img
            src="/img-header/logo/luwak-logo-main.webp"
            alt="LUWAK Manager"
            className="h-24 w-auto mx-auto mb-4 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <h1 className="text-3xl font-bold text-[#8B4513] mb-2">LUWAK Manager</h1>
          <p className="text-muted-foreground">Sistema de gestión LUWAK Manager</p>
        </div>

        {mode === ModeEnum.LOGIN && (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitchToRegister={() => switchMode(ModeEnum.REGISTER)}
            onForgotPassword={handleForgotPassword}
          />
        )}

        {mode === ModeEnum.REGISTER && (
          <RegisterForm
            onSuccess={handleRegisterSuccess}
            onSwitchToLogin={() => switchMode(ModeEnum.LOGIN)}
          />
        )}

        {mode === ModeEnum.RESET && (
          <ResetPasswordForm
            onBack={handleBackToForgot}
            onSuccess={handleResetSuccess}
          />
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
