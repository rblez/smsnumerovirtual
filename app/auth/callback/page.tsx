"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CheckCircle, X } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verificando tu sesión...");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
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
        {status === "loading" && (
          <>
            <h2 className="text-xl font-bold text-[#2E2E2E] mb-2">Cargando...</h2>
            <p className="text-[#3E3E3E]">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-[#2E2E2E] mb-2">¡Sesión iniciada!</h2>
            <p className="text-[#3E3E3E]">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-[#2E2E2E] mb-2">Error</h2>
            <p className="text-[#3E3E3E]">{message}</p>
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
          <h2 className="text-xl font-bold text-[#2E2E2E] mb-2">Cargando...</h2>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
