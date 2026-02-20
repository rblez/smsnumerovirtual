"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string; full_name?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("custom_id, full_name")
          .eq("id", authUser.id)
          .single();
        
        setUser({
          id: (profile as { custom_id?: string } | null)?.custom_id || authUser.id,
          email: authUser.email,
          full_name: (profile as { full_name?: string } | null)?.full_name,
        });
      }
    } catch (error) {
      console.error("Error checking session:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  const navLinks = [
    { href: "#features", label: "Características" },
    { href: "#how-it-works", label: "Cómo funciona" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E8E1D4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/isotipo.png"
              alt="SMS Número Virtual"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold text-[#2E2E2E] hidden sm:block">
              SMS Número Virtual
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[#3E3E3E] hover:text-[#2E2E2E] font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {!loading && (
              user ? (
                <>
                  <Link
                    href={`/~/${user.id}`}
                    className="text-[#3E3E3E] hover:text-[#2E2E2E] font-medium transition-colors"
                  >
                    Mi Cuenta
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-[#3E3E3E] hover:text-red-600 font-medium transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-[#3E3E3E] hover:text-[#2E2E2E] font-medium transition-colors"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/register"
                    className="bg-[#2E2E2E] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#3E3E3E] transition-colors"
                  >
                    Registrarse
                  </Link>
                </>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-[#3E3E3E]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#E8E1D4]">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-[#3E3E3E] hover:text-[#2E2E2E] font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-[#E8E1D4] space-y-3">
              {!loading && (
                user ? (
                  <>
                    <Link
                      href={`/~/${user.id}`}
                      className="block bg-[#2E2E2E] text-white px-4 py-2 rounded-lg font-medium text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mi Cuenta
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-[#3E3E3E] hover:text-red-600 font-medium py-2 text-left"
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block text-[#3E3E3E] hover:text-[#2E2E2E] font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      href="/register"
                      className="block bg-[#2E2E2E] text-white px-4 py-2 rounded-lg font-medium text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Registrarse
                    </Link>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
