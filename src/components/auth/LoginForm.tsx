
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "./AuthProvider";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Por favor ingrese su usuario"),
  password: z.string().min(1, "Por favor ingrese su contraseña"),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  onForgotPassword?: () => void;
}

export function LoginForm({
  onSuccess,
  onSwitchToRegister,
  onForgotPassword,
}: LoginFormProps) {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await login(data.username, data.password);
      onSuccess?.();
    } catch (err: any) {
      setError(err.errorMessage || "Error al iniciar sesión. Por favor intente nuevamente");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sm:rounded-lg sm:border sm:bg-card sm:text-card-foreground sm:shadow-sm w-full max-w-md mx-auto">
      <div className="flex flex-col items-center justify-center gap-[10px] py-[20px]">
        <div className="text-center text-2xl font-semibold">Bienvenido</div>
      </div>
      <div className="p-6 pt-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="mb-[4px] h-[22px] text-sm font-medium">Usuario</div>
            <Input
              id="username"
              type="text"
              placeholder="usuario"
              {...register("username")}
              disabled={isLoading}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between mb-[4px] h-[22px] text-sm font-medium">
              <span className="h-[22px]">Contraseña</span>
              {onForgotPassword && (
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-xs text-[#4F5A25] hover:underline cursor-pointer"
                  disabled={isLoading}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
            </div>
            <Input
              id="password"
              type="password"
              placeholder="contraseña"
              {...register("password")}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="remember" {...register("remember")} />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Recordar usuario
            </label>
          </div>

          <Button
            type="submit"
            className="w-full my-[10px] luwak-btn-primary"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Iniciar sesión
          </Button>
        </form>
      </div>
    </div>
  );
}
