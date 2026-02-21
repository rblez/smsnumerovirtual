"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";
import { 
  ArrowLeft, 
  User, 
  Lock, 
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";
import { SkeletonCard } from "../components/ui/Skeleton";

export default function AccountSettings() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email?: string; created_at?: string } | null>(null);
  const [profile, setProfile] = useState<{ full_name?: string; credits_balance?: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          router.push("/login?redirect=/account");
          return;
        }

        setUser({ id: authUser.id, email: authUser.email || "", created_at: authUser.created_at });

        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, credits_balance")
          .eq("id", authUser.id)
          .single();

        setProfile({
          full_name: profileData?.full_name ?? undefined,
          credits_balance: profileData?.credits_balance ?? undefined,
        });
        setFullName(profileData?.full_name || "");
      } catch (err) {
        console.error("Error checking user:", err);
        router.push("/login?redirect=/account");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [router]);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (!user?.id) return;
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName } as Database["public"]["Tables"]["profiles"]["Update"])
        .eq("id", user.id);

      if (error) throw error;

      setMessage({ type: "success", text: "Nombre actualizado correctamente" });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error al actualizar perfil";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Las contraseñas no coinciden" });
      setSaving(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "La contraseña debe tener al menos 6 caracteres" });
      setSaving(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setMessage({ type: "success", text: "Contraseña actualizada correctamente" });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error al actualizar contraseña";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        {/* Header Skeleton */}
        <header className="bg-white border-b border-[#E5E5E5] px-6 py-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="h-6 bg-[#E8E1D4] rounded w-48" />
            <div className="h-4 bg-[#E8E1D4] rounded w-32" />
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12">
          {/* Title Skeleton */}
          <div className="h-10 bg-[#E8E1D4] rounded w-80 mb-8" />

          {/* Profile Section Skeleton */}
          <SkeletonCard className="mb-8" />

          {/* Password Section Skeleton */}
          <SkeletonCard className="mb-8" />

          {/* Account Info Skeleton */}
          <div className="bg-[#E8E1D4]/20 border border-[#E8E1D4] rounded-2xl p-6">
            <div className="h-5 bg-[#E8E1D4] rounded w-48 mb-4" />
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="h-4 bg-[#E8E1D4] rounded w-24" />
                <div className="h-4 bg-[#E8E1D4] rounded w-16" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-[#E8E1D4] rounded w-32" />
                <div className="h-4 bg-[#E8E1D4] rounded w-20" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-[#E8E1D4] rounded w-28" />
                <div className="h-4 bg-[#E8E1D4] rounded w-18" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E5E5] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-[#2E2E2E]">SMS Número Virtual</span>
          </Link>
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 text-sm text-[#737373] hover:text-[#2E2E2E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-[#2E2E2E] mb-8">Configuración de Cuenta</h1>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === "success" 
                ? "bg-emerald-50 border border-emerald-200 text-emerald-700" 
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {message.type === "success" && <CheckCircle className="w-5 h-5" />}
            <span className="font-medium">{message.text}</span>
          </motion.div>
        )}

        <div className="space-y-8">
          {/* Profile Section */}
          <section className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#E8E1D4] flex items-center justify-center">
                <User className="w-5 h-5 text-[#2E2E2E]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#2E2E2E]">Información Personal</h2>
                <p className="text-sm text-[#737373]">Actualiza tu nombre de perfil</p>
              </div>
            </div>

            <form onSubmit={updateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#737373] mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl bg-gray-50 text-[#737373]"
                />
                <p className="text-xs text-[#737373] mt-1">El correo no se puede cambiar</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#737373] mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition-all"
                  placeholder="Tu nombre"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#2E2E2E] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#3E3E3E] transition-colors disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </section>

          {/* Password Section */}
          <section className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#E8E1D4] flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#2E2E2E]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#2E2E2E]">Cambiar Contraseña</h2>
                <p className="text-sm text-[#737373]">Actualiza tu contraseña de acceso</p>
              </div>
            </div>

            <form onSubmit={updatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#737373] mb-2">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition-all pr-12"
                    placeholder="••••••••"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#2E2E2E]"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#737373] mb-2">
                  Confirmar nueva contraseña
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent transition-all pr-12"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving || !newPassword || !confirmPassword}
                  className="flex items-center gap-2 bg-[#2E2E2E] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#3E3E3E] transition-colors disabled:opacity-50"
                >
                  {saving ? "Actualizando..." : "Cambiar Contraseña"}
                </button>
              </div>
            </form>
          </section>

          {/* Account Info */}
          <section className="bg-[#E8E1D4]/20 border border-[#E8E1D4] rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-[#2E2E2E] mb-4">Información de la cuenta</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#737373]">ID de usuario:</span>
                <span className="text-[#2E2E2E] font-mono">{user?.id?.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737373]">Cuenta creada:</span>
                <span className="text-[#2E2E2E]">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString("es-ES") : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737373]">Balance de coins:</span>
                <span className="text-[#2E2E2E] font-semibold">{profile?.credits_balance || 0} coins</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
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
