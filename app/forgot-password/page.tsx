"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "El correo electrónico es requerido";
    if (!emailRegex.test(email)) return "Ingresa un correo electrónico válido";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setEmailError(null);

    const emailValidation = validateEmail(email);
    if (emailValidation) {
      setEmailError(emailValidation);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar el correo");
      }

      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Error al enviar el correo");
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
            <span className="font-[family-name:var(--font-mona-sans)] text-xl font-bold text-[#2E2E2E]">
              SMS Número Virtual
            </span>
          </Link>

          <div className="mt-8 p-6 sm:p-7 text-center">
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700">
              <CheckCircle className="w-8 h-8 mx-auto mb-3" />
              <h2 className="text-lg font-semibold mb-2">Correo enviado</h2>
              <p className="text-sm">
                Hemos enviado un enlace de recuperación a <strong>{email}</strong>
              </p>
            </div>

            <p className="text-sm text-[#737373] mb-6">
              Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
            </p>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-[#2E2E2E] font-medium hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio de sesión
            </Link>
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
          <span className="font-[family-name:var(--font-mona-sans)] text-xl font-bold text-[#2E2E2E]">
            SMS Número Virtual
          </span>
        </Link>

        <h1 className="text-center text-2xl font-semibold tracking-tight text-[#2E2E2E]">
          Recuperar contraseña
        </h1>
        <p className="mt-2 text-center text-sm text-[#737373]">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
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
                htmlFor="email"
                className="text-sm font-medium text-[#2E2E2E] mb-2 block"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${emailFocused ? 'text-[#2E2E2E]' : 'text-[#737373]'}`} />
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

            <button
              type="submit"
              disabled={loading || !!emailError}
              className="w-full rounded-xl bg-[#2E2E2E] py-3.5 text-center text-[15px] font-semibold text-white shadow-lg shadow-black/10 transition-colors hover:bg-[#3E3E3E] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Enviando...
                </div>
              ) : (
                "Enviar enlace de recuperación"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#737373]">
            ¿Recuerdas tu contraseña?{" "}
            <Link
              href="/login"
              className="font-medium text-[#2E2E2E] hover:underline"
            >
              Inicia sesión
            </Link>
          </p>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[#737373] hover:text-[#2E2E2E] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
