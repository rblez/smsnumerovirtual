"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const validatePassword = (password: string) => {
    if (!password) return "La contraseña es requerida";
    if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const passwordValidation = validatePassword(password);
    if (passwordValidation) {
      setError(passwordValidation);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al restablecer contraseña");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al restablecer contraseña");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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

          <div className="mt-8 p-6 sm:p-7 text-center">
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700">
              <CheckCircle className="w-8 h-8 mx-auto mb-3" />
              <h2 className="text-lg font-semibold mb-2">¡Contraseña actualizada!</h2>
              <p className="text-sm">
                Tu contraseña ha sido restablecida exitosamente. Serás redirigido al inicio de sesión...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          Restablecer contraseña
        </h1>
        <p className="mt-2 text-center text-sm text-[#737373]">
          Crea una nueva contraseña para tu cuenta
        </p>

        <div className="mt-8 p-6 sm:p-7">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-[#2E2E2E] mb-2 block"
              >
                Nueva contraseña
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${passwordFocused ? 'text-[#2E2E2E]' : 'text-[#737373]'}`} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="Mínimo 6 caracteres"
                  className="h-12 w-full rounded-xl border bg-white px-4 pl-10 pr-14 text-[15px] text-[#2E2E2E] placeholder:text-[#A3A3A3] shadow-sm outline-none transition-colors focus:ring-2 focus:ring-[#2E2E2E]/10 border-[#E5E5E5] focus:border-[#2E2E2E]/40"
                  required
                  minLength={6}
                  data-lpignore="true"
                  data-bwignore="true"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#2E2E2E] transition-colors z-10"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-[#2E2E2E] mb-2 block"
              >
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${confirmPasswordFocused ? 'text-[#2E2E2E]' : 'text-[#737373]'}`} />
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setConfirmPasswordFocused(true)}
                  onBlur={() => setConfirmPasswordFocused(false)}
                  placeholder="Repite tu contraseña"
                  className="h-12 w-full rounded-xl border bg-white px-4 pl-10 pr-14 text-[15px] text-[#2E2E2E] placeholder:text-[#A3A3A3] shadow-sm outline-none transition-colors focus:ring-2 focus:ring-[#2E2E2E]/10 border-[#E5E5E5] focus:border-[#2E2E2E]/40"
                  required
                  data-lpignore="true"
                  data-bwignore="true"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#2E2E2E] transition-colors z-10"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#2E2E2E] py-3.5 text-center text-[15px] font-semibold text-white shadow-lg shadow-black/10 transition-colors hover:bg-[#3E3E3E] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Actualizando...
                </div>
              ) : (
                "Restablecer contraseña"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-[#737373] hover:text-[#2E2E2E] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="mt-16 pt-8 border-t border-[#E5E5E5] text-center">
          <p className="text-[10px] tracking-wide text-[#A0A0A0]">
            © 2026 SMS Número Virtual. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo skeleton */}
          <div className="flex justify-center mb-8">
            <div className="h-12 w-48 bg-[#E8E1D4] rounded" />
          </div>

          {/* Form skeleton */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            {/* Title skeleton */}
            <div className="h-8 bg-[#E8E1D4] rounded w-56 mx-auto mb-6" />

            {/* Password field skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-[#E8E1D4] rounded w-24" />
              <div className="h-12 bg-[#E8E1D4] rounded-xl" />
            </div>

            {/* Confirm password field skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-[#E8E1D4] rounded w-32" />
              <div className="h-12 bg-[#E8E1D4] rounded-xl" />
            </div>

            {/* Submit button skeleton */}
            <div className="h-12 bg-[#E8E1D4] rounded-xl" />

            {/* Back link skeleton */}
            <div className="text-center">
              <div className="h-4 bg-[#E8E1D4] rounded w-40 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
