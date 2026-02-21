"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SFIcon } from '@bradleyhodges/sfsymbols-react'
import { sfEnvelope, sfPerson, sfLock, sfEye, sfEyeSlash, sfChevronLeft } from '@bradleyhodges/sfsymbols'
import Image from "next/image";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Enhanced form state
  const [fullNameFocused, setFullNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  // Form validation functions
  const validateFullName = (name: string) => {
    if (!name.trim()) return "El nombre completo es requerido";
    if (name.trim().length < 2) return "El nombre debe tener al menos 2 caracteres";
    return null;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "El correo electrónico es requerido";
    if (!emailRegex.test(email)) return "Ingresa un correo electrónico válido";
    return null;
  };

  const validatePassword = (password: string) => {
    if (!password) return "La contraseña es requerida";
    if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) return "La contraseña debe contener mayúsculas y minúsculas";
    if (!/(?=.*\d)/.test(password)) return "La contraseña debe contener al menos un número";
    return null;
  };

  const validateConfirmPassword = (confirmPassword: string, password: string) => {
    if (!confirmPassword) return "Confirma tu contraseña";
    if (confirmPassword !== password) return "Las contraseñas no coinciden";
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFullNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);

    // Validate form
    const fullNameValidation = validateFullName(fullName);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validateConfirmPassword(confirmPassword, password);

    if (fullNameValidation) {
      setFullNameError(fullNameValidation);
      setLoading(false);
      return;
    }

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

    if (confirmPasswordValidation) {
      setConfirmPasswordError(confirmPasswordValidation);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          fullName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al registrarse");
      }

      // Redirigir al dashboard del usuario
      router.push(`/~/${data.user.id}`);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al registrarse");
    } finally {
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
          Crea tu cuenta para comenzar
        </h1>

        <div className="mt-8 p-6 sm:p-7">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="text-sm font-medium text-[#2E2E2E] mb-2 block">
              Nombre completo
            </label>
            <div className="relative">
              <SFIcon icon={sfPerson} size={20} color={fullNameFocused ? '#2E2E2E' : '#737373'} className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors" />
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (fullNameError) setFullNameError(null);
                }}
                onFocus={() => setFullNameFocused(true)}
                onBlur={() => setFullNameFocused(false)}
                placeholder="Tu nombre completo"
                className={`h-12 w-full rounded-xl border bg-white px-4 pl-10 text-[15px] text-[#2E2E2E] placeholder:text-[#A3A3A3] shadow-sm outline-none transition-colors focus:ring-2 focus:ring-[#2E2E2E]/10 ${fullNameError ? 'border-red-300 focus:border-red-500' : 'border-[#E5E5E5] focus:border-[#2E2E2E]/40'}`}
                required
              />
            </div>
            {fullNameError && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {fullNameError}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-[#2E2E2E] mb-2 block">
              Correo electrónico
            </label>
            <div className="relative">
              <SFIcon icon={sfEnvelope} size={20} color={emailFocused ? '#2E2E2E' : '#737373'} className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                placeholder="tu@email.com"
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

          {/* Password */}
          <div>
            <label htmlFor="password" className="text-sm font-medium text-[#2E2E2E] mb-2 block">
              Contraseña
            </label>
            <div className="relative">
              <SFIcon icon={sfLock} size={20} color={passwordFocused ? '#2E2E2E' : '#737373'} className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(null);
                }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                placeholder="Mínimo 6 caracteres"
                className={`h-12 w-full rounded-xl border bg-white px-4 pl-10 pr-14 text-[15px] text-[#2E2E2E] placeholder:text-[#A3A3A3] shadow-sm outline-none transition-colors focus:ring-2 focus:ring-[#2E2E2E]/10 ${passwordError ? 'border-red-300 focus:border-red-500' : 'border-[#E5E5E5] focus:border-[#2E2E2E]/40'}`}
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

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="text-sm font-medium text-[#2E2E2E] mb-2 block">
              Confirmar contraseña
            </label>
            <div className="relative">
              <SFIcon icon={sfLock} size={20} color={confirmPasswordFocused ? '#2E2E2E' : '#737373'} className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors" />
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (confirmPasswordError) setConfirmPasswordError(null);
                }}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
                placeholder="Repite tu contraseña"
                className={`h-12 w-full rounded-xl border bg-white px-4 pl-10 pr-14 text-[15px] text-[#2E2E2E] placeholder:text-[#A3A3A3] shadow-sm outline-none transition-colors focus:ring-2 focus:ring-[#2E2E2E]/10 ${confirmPasswordError ? 'border-red-300 focus:border-red-500' : 'border-[#E5E5E5] focus:border-[#2E2E2E]/40'}`}
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
            {confirmPasswordError && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {confirmPasswordError}
              </p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3">
            <input
              id="terms"
              type="checkbox"
              className="mt-0.5 w-4 h-4 rounded border-[#E5E5E5] text-[#2E2E2E] focus:ring-[#2E2E2E]"
              required
            />
            <label htmlFor="terms" className="text-sm text-[#737373] leading-relaxed">
              Acepto los{" "}
              <Link href="/terms" className="text-[#2E2E2E] font-medium hover:underline">
                términos de servicio
              </Link>{" "}
              y la{" "}
              <Link href="/privacy" className="text-[#2E2E2E] font-medium hover:underline">
                política de privacidad
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !!fullNameError || !!emailError || !!passwordError || !!confirmPasswordError}
            className="w-full rounded-xl bg-[#2E2E2E] py-3.5 text-center text-[15px] font-semibold text-white shadow-lg shadow-black/10 transition-colors hover:bg-[#3E3E3E] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creando cuenta...
              </div>
            ) : (
              "Crear cuenta"
            )}
          </button>
        </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-[#737373]">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-medium text-[#2E2E2E] hover:underline">
              Inicia sesión
            </Link>
          </p>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#3E3E3E] hover:text-[#2E2E2E] font-medium transition-colors"
            >
              <SFIcon icon={sfChevronLeft} size={16} color="currentColor" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              2026 SMS Número Virtual. Todos los derechos reservados.
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
