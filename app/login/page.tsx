"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { SFIcon } from '@bradleyhodges/sfsymbols-react'
import { sfEnvelope, sfLock, sfEye, sfEyeSlash, sfCheckmarkCircle, sfChevronLeft } from '@bradleyhodges/sfsymbols'
import Image from "next/image";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";

  // Enhanced form state
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  // Form validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "El correo electrónico es requerido";
    if (!emailRegex.test(email)) return "Ingresa un correo electrónico válido";
    return null;
  };

  const validatePassword = (password: string) => {
    if (!password) return "La contraseña es requerida";
    if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    return null;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setEmailError(null);
    setPasswordError(null);

    // Validate form
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (emailValidation) {
      setEmailError(emailValidation);
      setLoading(false);
      return;
    }

    if (passwordValidation) {
      setPasswordError(passwordValidation);
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      await new Promise(resolve => setTimeout(resolve, 500));
      
      const redirectParam = searchParams.get("redirect");
      
      if (redirectParam) {
        window.location.replace(redirectParam);
      } else {
        window.location.replace("/");
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al iniciar sesión");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#FAFAFA] to-[#E8E1D4]/30 px-4 py-10 lg:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center">
        <Link href="/" className="flex items-center justify-center gap-3 mb-6">
          <Image
            src="/isotipo.png"
            alt="SMS Número Virtual"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
          <span className="text-xl font-bold text-[#2E2E2E]">
            SMS Número Virtual
          </span>
        </Link>
        <h1 className="text-center text-2xl font-semibold tracking-tight text-[#2E2E2E]">
          Inicia sesión en tu cuenta
        </h1>

        <div className="mt-8 p-6 sm:p-7">
        {justRegistered && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm flex items-center gap-3">
            <SFIcon icon={sfCheckmarkCircle} size={20} color="currentColor" />
            <span className="font-medium">¡Cuenta creada! Ahora puedes iniciar sesión</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-[#2E2E2E] mb-2 block"
            >
              Correo electrónico
            </label>
            <div className="relative">
              <SFIcon icon={sfEnvelope} size={20} color={emailFocused ? '#2E2E2E' : '#737373'} className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                className={`h-12 w-full rounded-xl border bg-white px-4 pl-10 text-[15px] text-[#2E2E2E] placeholder:text-[#A3A3A3] shadow-sm outline-none transition-colors focus:ring-2 focus:ring-[#2E2E2E]/10 ${emailError ? 'border-red-300 focus:border-red-500' : 'border-[#E5E5E5] focus:border-[#2E2E2E]/40'}`}
                required
              />
            </div>
            {emailError && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {emailError}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-[#2E2E2E] mb-2 block"
            >
              Contraseña
            </label>
            <div className="relative">
              <SFIcon icon={sfLock} size={20} color={passwordFocused ? '#2E2E2E' : '#737373'} className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(null);
                }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className={`h-12 w-full rounded-xl border bg-white px-4 pl-10 pr-14 text-[15px] text-[#2E2E2E] placeholder:text-[#A3A3A3] shadow-sm outline-none transition-colors focus:ring-2 focus:ring-[#2E2E2E]/10 ${passwordError ? 'border-red-300 focus:border-red-500' : 'border-[#E5E5E5] focus:border-[#2E2E2E]/40'}`}
                required
                data-lpignore="true"
                data-bwignore="true"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#2E2E2E] transition-colors z-10"
              >
                <SFIcon icon={showPassword ? sfEyeSlash : sfEye} size={20} color="currentColor" />
              </button>
            </div>
            {passwordError && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {passwordError}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#E5E5E5] text-[#2E2E2E] focus:ring-[#2E2E2E]"
              />
              <label htmlFor="remember" className="text-sm text-[#737373]">
                Recordarme
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-sm text-[#2E2E2E] hover:text-[#3E3E3E] transition-colors font-medium"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading || !!emailError || !!passwordError}
            className="w-full rounded-xl bg-[#2E2E2E] py-3.5 text-center text-[15px] font-semibold text-white shadow-lg shadow-black/10 transition-colors hover:bg-[#3E3E3E] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Iniciando sesión...
              </div>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#737373]">
          ¿No tienes cuenta?{" "}
          <Link
            href="/register"
            className="font-medium text-[#2E2E2E] hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#737373] hover:text-[#2E2E2E] transition-colors"
          >
            <SFIcon icon={sfChevronLeft} size={16} color="currentColor" />
            Volver al inicio
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#FAFAFA] to-[#E8E1D4]/30">
      <Suspense fallback={
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            {/* Logo skeleton */}
            <div className="flex justify-center mb-8">
              <div className="h-12 w-48 bg-[#E8E1D4] rounded" />
            </div>

            {/* Form skeleton */}
            <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
              {/* Email field skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-[#E8E1D4] rounded w-16" />
                <div className="h-12 bg-[#E8E1D4] rounded-xl" />
              </div>

              {/* Password field skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-[#E8E1D4] rounded w-20" />
                <div className="h-12 bg-[#E8E1D4] rounded-xl" />
              </div>

              {/* Remember me skeleton */}
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-[#E8E1D4] rounded" />
                <div className="h-4 bg-[#E8E1D4] rounded w-24" />
              </div>

              {/* Forgot password skeleton */}
              <div className="h-4 bg-[#E8E1D4] rounded w-40" />

              {/* Submit button skeleton */}
              <div className="h-12 bg-[#E8E1D4] rounded-xl" />

              {/* Register link skeleton */}
              <div className="text-center space-y-2">
                <div className="h-4 bg-[#E8E1D4] rounded w-64 mx-auto" />
                <div className="h-4 bg-[#E8E1D4] rounded w-32 mx-auto" />
              </div>

              {/* Back link skeleton */}
              <div className="text-center">
                <div className="h-4 bg-[#E8E1D4] rounded w-28 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      }>
        <LoginContent />
      </Suspense>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © 2026 SMS Número Virtual. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
                Términos de Servicio
              </Link>
              <Link href="/privacy" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
                Políticas de Privacidad
              </Link>
              <span className="text-gray-300">|</span>
              <a href="https://t.me/smsnumerovirtual" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
