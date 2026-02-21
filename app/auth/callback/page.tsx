"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CheckCircle, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Procesando...");
  const [isEmailConfirmation, setIsEmailConfirmation] = useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if this is email confirmation
        const code = searchParams.get("code");
        const type = searchParams.get("type");
        
        if (code && type === "email_confirmation") {
          setIsEmailConfirmation(true);
          setMessage("Confirmando tu cuenta...");
          
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error("Email confirmation error:", error);
            setStatus("error");
            setMessage("El enlace de confirmación ha expirado o no es válido.");
            return;
          }

          if (data.session) {
            // Email confirmation handled automatically by Supabase
            setStatus("success");
            setMessage("¡Tu cuenta ha sido confirmada exitosamente!");
            
            setTimeout(() => {
              router.push(`/~/${data.session!.user.id}`);
            }, 2000);
          }
          return;
        }

        // Regular auth callback
        const redirectTo = searchParams.get("redirect") || "/send";
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          setStatus("error");
          setMessage("Error al verificar tu sesión. Por favor intenta de nuevo.");
          return;
        }

        if (session) {
          setStatus("success");
          setMessage("¡Bienvenido! Redirigiendo...");
          
          setTimeout(() => {
            router.push(redirectTo);
          }, 1500);
        } else {
          setStatus("error");
          setMessage("No se encontró sesión activa. Por favor inicia sesión.");
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setStatus("error");
        setMessage("Ocurrió un error inesperado.");
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#E8E1D4] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
        <Image src="/isotipo.png" alt="SMS Número Virtual" width={64} height={64} className="h-16 w-auto mx-auto mb-6" />
        
        {status === "loading" && (
          <>
            <div className="animate-spin w-8 h-8 border-2 border-[#2E2E2E] border-t-transparent rounded-full mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#2E2E2E] mb-2">
              {isEmailConfirmation ? "Confirmando cuenta..." : "Cargando..."}
            </h2>
            <p className="text-[#3E3E3E]">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-[#2E2E2E] mb-2">
              {isEmailConfirmation ? "¡Cuenta Confirmada!" : "¡Sesión iniciada!"}
            </h2>
            <p className="text-[#3E3E3E]">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-[#2E2E2E] mb-2">
              {isEmailConfirmation ? "Error de Confirmación" : "Error"}
            </h2>
            <p className="text-[#3E3E3E] mb-6">{message}</p>
            <Link 
              href={isEmailConfirmation ? "/register" : "/login"} 
              className="inline-block bg-[#2E2E2E] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3E3E3E] transition-colors"
            >
              {isEmailConfirmation ? "Volver al Registro" : "Iniciar Sesión"}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#E8E1D4] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          {/* Logo skeleton */}
          <div className="h-16 w-16 bg-[#E8E1D4] rounded-full mx-auto mb-6" />

          {/* Icon skeleton */}
          <div className="w-16 h-16 bg-[#E8E1D4] rounded-full flex items-center justify-center mx-auto mb-4" />

          {/* Title skeleton */}
          <div className="h-6 bg-[#E8E1D4] rounded w-48 mx-auto mb-2" />

          {/* Message skeleton */}
          <div className="h-4 bg-[#E8E1D4] rounded w-64 mx-auto mb-6" />

          {/* Button skeleton */}
          <div className="h-12 bg-[#E8E1D4] rounded-xl w-32 mx-auto" />
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
