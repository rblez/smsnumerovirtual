"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Send,
  Clock,
  Coins,
  Globe,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";
import Image from "next/image";

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export default function Layout({ children, showSidebar = true }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string; full_name?: string } | null>(null);
  const [profile, setProfile] = useState<{ credits_balance?: number } | null>(null);
  const pathname = usePathname();

  const checkSession = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();
        
        setUser({
          email: authUser.email,
          full_name: (profileData as { full_name?: string } | null)?.full_name,
        });
        setProfile(profileData);
      }
    } catch (error) {
      console.error("Error checking session:", error);
    }
    // finally {
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    const init = async () => {
      await checkSession();
    };
    init();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const navItems = [
    { href: "/dashboard", label: "Enviar SMS", icon: Send },
    { href: "/history", label: "Historial", icon: Clock },
    { href: "/rates", label: "Tarifas", icon: Globe },
  ];

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Background Grid */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundSize: "40px 40px",
          backgroundImage: `linear-gradient(to right, rgba(232, 225, 212, 0.3) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(232, 225, 212, 0.3) 1px, transparent 1px)`,
        }}
      />

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E5E5E5]/50 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/isotipo.png"
            alt="SMS Número Virtual"
            width={24}
            height={24}
            className="h-6 w-auto"
          />
          <span className="font-sans text-sm font-bold tracking-tight text-[#2E2E2E]">
            SMS VIRTUAL
          </span>
        </Link>
          <div className="flex items-center space-x-2 bg-[#E8E1D4]/20 px-3 py-1.5 rounded-lg">
            <Coins className="w-4 h-4 text-[#2E2E2E]" />
            <span className="font-semibold text-[#2E2E2E] text-xs">
              {(profile?.credits_balance || 0)} coins
            </span>
          </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        bg-white border-r border-[#E5E5E5] flex flex-col fixed h-full z-50
        transition-transform duration-300 ease-in-out
        w-64
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        {/* Logo */}
        <div className="hidden md:block p-6 border-b border-[#E5E5E5]">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/isotipo.png"
              alt="SMS Número Virtual"
              width={24}
              height={24}
              className="h-6 w-auto"
            />
            <span className="font-sans text-sm font-bold tracking-tight text-[#2E2E2E]">
              SMS NÚMERO VIRTUAL
            </span>
          </Link>
        </div>

        {/* Spacer for mobile header */}
        <div className="md:hidden h-14" />

        {/* User Info */}
        <div className="p-6 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#E8E1D4] flex items-center justify-center">
              <User className="w-5 h-5 text-[#2E2E2E]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-[#2E2E2E] truncate">
                {user?.full_name || "Usuario"}
              </p>
              <p className="text-xs text-[#737373] truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-[#E8E1D4]/20 px-3 py-2 rounded-lg">
            <Coins className="w-4 h-4 text-[#2E2E2E]" />
            <span className="font-semibold text-sm text-[#2E2E2E]">
              {(profile?.credits_balance || 0)} coins
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-[#E8E1D4] text-[#2E2E2E] font-semibold"
                    : "text-[#737373] hover:bg-[#E8E1D4]/30 hover:text-[#2E2E2E]"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-[#E5E5E5]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-[#737373] hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 relative z-10">
        {children}
      </main>
    </div>
  );
}

