"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { SFIcon } from '@bradleyhodges/sfsymbols-react'
import { sfPaperplane, sfChartBar, sfGear, sfArrowLeft } from '@bradleyhodges/sfsymbols'
import { motion } from "framer-motion";

// Skeleton components
const SkeletonStats = ({ count = 4 }: { count?: number }) => (
  <div className={`grid grid-cols-1 ${count === 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3"} gap-6`}>
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        className="bg-white rounded-xl p-6 border border-[#E5E5E5]"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3 bg-[#E8E1D4] rounded w-24" />
            <div className="h-8 bg-[#E8E1D4] rounded w-16" />
          </div>
          <div className="w-10 h-10 bg-[#E8E1D4] rounded-lg" />
        </div>
      </motion.div>
    ))}
  </div>
);

const SkeletonTable = ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => (
  <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
    <table className="w-full">
      <thead className="bg-[#E8E1D4]/30">
        <tr>
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i} className="px-6 py-4">
              <div className="h-4 bg-[#E8E1D4] rounded w-20" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-[#E5E5E5]">
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i}>
            {Array.from({ length: columns }).map((_, j) => (
              <td key={j} className="px-6 py-4">
                <motion.div
                  className="h-4 bg-[#E8E1D4] rounded"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: j * 0.05 }}
                  style={{ width: j === 0 ? "80%" : j === columns - 1 ? "40%" : "60%" }}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

interface UserProfile {
  id: string;
  full_name?: string;
  email?: string;
  credits_balance?: number;
  created_at?: string;
}

interface SMSStats {
  total_sent: number;
  total_countries: number;
}

export default function Dashboard({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<SMSStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          router.push("/login");
          return;
        }

        // Check if user is viewing their own profile
        const isOwner = authUser.id === params.id;
        setIsOwnProfile(isOwner);

        // Fetch profile data
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, credits_balance, created_at")
          .eq("id", params.id)
          .single();

        if (profile) {
          setUser({
            id: params.id,
            full_name: profile?.full_name ?? undefined,
            email: authUser.email,
            credits_balance: profile?.credits_balance ?? undefined,
            created_at: profile?.created_at ?? undefined,
          });
        }

        // Fetch SMS stats (mock data for skeleton)
        // In real implementation, this would fetch from database
        setStats({
          total_sent: 0,
          total_countries: 0,
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        {/* Header Skeleton */}
        <header className="bg-white border-b border-[#E5E5E5] px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/isotipo.png" alt="SMS Número Virtual" width={48} height={48} className="h-12 w-auto" />
            </Link>
            <div className="flex items-center gap-4">
              <div className="h-9 w-24 bg-[#E8E1D4] rounded" />
              <div className="h-9 w-9 bg-[#E8E1D4] rounded-full" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Section Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-[#E8E1D4] rounded w-64 mb-2" />
            <div className="h-4 bg-[#E8E1D4] rounded w-96" />
          </div>

          {/* Stats Skeleton */}
          <SkeletonStats count={4} />

          {/* Quick Actions Skeleton */}
          <div className="mb-8">
            <div className="h-6 bg-[#E8E1D4] rounded w-32 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-[#E5E5E5]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#E8E1D4] rounded-lg" />
                    <div className="flex-1">
                      <div className="h-5 bg-[#E8E1D4] rounded w-32 mb-2" />
                      <div className="h-4 bg-[#E8E1D4] rounded w-48" />
                    </div>
                  </div>
                  <div className="h-10 bg-[#E8E1D4] rounded-lg w-full mt-4" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent SMS Skeleton */}
          <div className="mb-8">
            <div className="h-6 bg-[#E8E1D4] rounded w-40 mb-4" />
            <SkeletonTable rows={5} columns={4} />
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#2E2E2E] mb-4">Usuario no encontrado</h1>
          <Link href="/" className="inline-flex items-center gap-2 bg-[#2E2E2E] text-white px-6 py-3 rounded-xl hover:bg-[#3E3E3E] transition-colors">
            <SFIcon icon={sfArrowLeft} size={16} color="currentColor" />
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E5E5] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/isotipo.png" alt="SMS Número Virtual" width={48} height={48} className="h-12 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#E8E1D4] px-3 py-1.5 rounded-lg">
              <SFIcon icon={sfChartBar} size={16} color="#2E2E2E" />
              <span className="font-semibold text-[#2E2E2E] text-sm">
                {user.credits_balance || 0} coins
              </span>
            </div>
            {isOwnProfile && (
              <Link
                href="/account"
                className="w-9 h-9 rounded-full bg-[#2E2E2E] text-white flex items-center justify-center hover:bg-[#3E3E3E] transition-colors"
              >
                <SFIcon icon={sfGear} size={16} color="currentColor" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2E2E2E] mb-2">
            ¡Hola, {user.full_name || "Usuario"}!
          </h1>
          <p className="text-[#737373]">
            Bienvenido a tu dashboard de SMS Número Virtual
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-[#E5E5E5]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#737373] font-medium">SMS Enviados</p>
                <p className="text-2xl font-bold text-[#2E2E2E]">{stats?.total_sent || 0}</p>
              </div>
              <div className="w-12 h-12 bg-[#E8E1D4] rounded-lg flex items-center justify-center">
                <SFIcon icon={sfPaperplane} size={24} color="#2E2E2E" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#E5E5E5]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#737373] font-medium">Países</p>
                <p className="text-2xl font-bold text-[#2E2E2E]">{stats?.total_countries || 0}</p>
              </div>
              <div className="w-12 h-12 bg-[#E8E1D4] rounded-lg flex items-center justify-center">
                <span className="text-2xl">🌍</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#E5E5E5]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#737373] font-medium">Balance</p>
                <p className="text-2xl font-bold text-[#2E2E2E]">{user.credits_balance || 0}</p>
              </div>
              <div className="w-12 h-12 bg-[#E8E1D4] rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#E5E5E5]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#737373] font-medium">Miembro desde</p>
                <p className="text-sm font-bold text-[#2E2E2E]">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString("es-ES", { month: "short", year: "numeric" }) : "-"}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#E8E1D4] rounded-lg flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#2E2E2E] mb-4">Acciones rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/dashboard"
              className="bg-white rounded-xl p-6 border border-[#E5E5E5] hover:border-[#2E2E2E] transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#E8E1D4] rounded-lg flex items-center justify-center group-hover:bg-[#2E2E2E] transition-colors">
                  <SFIcon icon={sfPaperplane} size={24} color="currentColor" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#2E2E2E] group-hover:text-[#2E2E2E]">Enviar SMS</h3>
                  <p className="text-sm text-[#737373]">Envía mensajes a cualquier número</p>
                </div>
              </div>
            </Link>

            <Link
              href="/history"
              className="bg-white rounded-xl p-6 border border-[#E5E5E5] hover:border-[#2E2E2E] transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#E8E1D4] rounded-lg flex items-center justify-center group-hover:bg-[#2E2E2E] transition-colors">
                  <SFIcon icon={sfChartBar} size={24} color="currentColor" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#2E2E2E] group-hover:text-[#2E2E2E]">Historial</h3>
                  <p className="text-sm text-[#737373]">Revisa tus mensajes enviados</p>
                </div>
              </div>
            </Link>

            <Link
              href="/rates"
              className="bg-white rounded-xl p-6 border border-[#E5E5E5] hover:border-[#2E2E2E] transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#E8E1D4] rounded-lg flex items-center justify-center group-hover:bg-[#2E2E2E] transition-colors">
                  <span className="text-xl">💰</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[#2E2E2E] group-hover:text-[#2E2E2E]">Tarifas</h3>
                  <p className="text-sm text-[#737373]">Consulta precios por país</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent SMS */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#2E2E2E] mb-4">Mensajes recientes</h2>
          <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
            <div className="p-6 text-center text-[#737373]">
              <SFIcon icon={sfPaperplane} size={48} color="#E8E1D4" />
              <h3 className="text-lg font-semibold text-[#2E2E2E] mt-4 mb-2">No has enviado SMS aún</h3>
              <p className="mb-4">Comienza enviando tu primer mensaje</p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-[#2E2E2E] text-white px-6 py-3 rounded-xl hover:bg-[#3E3E3E] transition-colors"
              >
                <SFIcon icon={sfPaperplane} size={16} color="currentColor" />
                Enviar SMS
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
