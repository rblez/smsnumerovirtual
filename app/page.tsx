"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useSpring, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Menu,
  X,
  Settings,
  LogOut,
} from "lucide-react";
import { GlobeCanvas } from "./components/GlobeCanvas";

const FloatingParticles = () => {
  const particles = useMemo(() => 
    [...Array(15)].map((_, i) => ({
      id: i,
      left: `${(i * 7) % 100}%`,
      top: `${(i * 13) % 100}%`,
      duration: 4 + (i % 4),
      delay: (i % 3),
    })), []
  );
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-2 h-2 bg-[#E8E1D4]/40 rounded-full"
          style={{ left: p.left, top: p.top }}
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3], scale: [1, 1.5, 1] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
        />
      ))}
    </div>
  );
};

const useAnimatedCounter = (end: number, duration: number = 2) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);
  return { count, ref };
};

const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 60 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}>
      {children}
    </motion.div>
  );
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [user, setUser] = useState<{ id: string; full_name?: string; email?: string } | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { supabase } = await import("@/lib/supabase");
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, custom_id")
          .eq("id", authUser.id)
          .single();
        setUser({ 
          id: profile?.custom_id || authUser.id,
          full_name: profile?.full_name ?? undefined, 
          email: authUser.email 
        });
      }
    };
    checkUser();
  }, []);

  const countriesCounter = useAnimatedCounter(200, 2);
  const smsCounter = useAnimatedCounter(50000, 3);
  const usersCounter = useAnimatedCounter(500, 2);
  const uptimeCounter = useAnimatedCounter(99, 2);

  return (
    <div ref={containerRef} className="w-full relative bg-[#FAFAFA] overflow-x-hidden">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#2E2E2E] z-50 origin-left" style={{ scaleX: springScroll }} />
      
      <motion.header initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6 }} className={`fixed top-0 left-0 right-0 z-40 w-full px-6 py-5 md:px-12 flex justify-between items-center backdrop-blur-md border-b border-[#E5E5E5]/50 transition-all ${scrollY > 50 ? "bg-white/90 shadow-sm" : "bg-[#FAFAFA]/90"}`}>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/isotipo.png" alt="SMS Número Virtual" width={32} height={32} className="h-8 w-auto" />
          <span className="hidden md:block font-[family-name:var(--font-mona-sans)] text-sm font-bold tracking-tight text-[#2E2E2E]">SMS Número Virtual</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {["Características", "Precios", "Cómo Funciona"].map((item, i) => (
            <motion.div key={item} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
              <Link href={`#${["features", "pricing", "how-it-works"][i]}`} className="font-sans text-xs font-medium text-[#737373] hover:text-[#2E2E2E] transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2E2E2E] transition-all group-hover:w-full" />
              </Link>
            </motion.div>
          ))}
        </nav>
        <div className="flex items-center gap-5">
          {user ? (
            <div className="relative">
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-9 h-9 rounded-full bg-[#2E2E2E] text-white flex items-center justify-center text-sm font-bold hover:bg-[#3E3E3E] transition-colors"
              >
                {user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
              </motion.button>
                {showUserMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#E5E5E5] rounded-xl shadow-lg py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-[#E5E5E5]">
                      <p className="text-sm font-medium text-[#2E2E2E]">{user.full_name || "Usuario"}</p>
                      <p className="text-xs text-[#737373] truncate">{user.email}</p>
                    </div>
                    <Link href={`/~/${user.id}`} className="flex items-center gap-2 px-4 py-2 text-sm text-[#737373] hover:bg-[#FAFAFA] hover:text-[#2E2E2E] transition-colors md:hidden">Mi Cuenta</Link>
                    <Link href={`/~/${user.id}`} className="flex items-center gap-2 px-4 py-2 text-sm text-[#737373] hover:bg-[#FAFAFA] hover:text-[#2E2E2E] transition-colors">
                      <Settings className="w-4 h-4" />
                      Configuración
                    </Link>
                    <button 
                      onClick={async () => {
                        const { supabase } = await import("@/lib/supabase");
                        await supabase.auth.signOut();
                        setUser(null);
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </motion.div>
                )}
              </div>
          ) : (
            <>
              <Link href="/login" className="hidden md:block font-sans text-xs font-medium text-[#737373] hover:text-[#2E2E2E]">Iniciar Sesión</Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/register" className="bg-[#2E2E2E] text-white text-xs font-semibold px-6 py-2.5 rounded shadow-lg shadow-[#2E2E2E]/20 hover:shadow-xl">Crear Cuenta</Link>
              </motion.div>
            </>
          )}
          <motion.button whileTap={{ scale: 0.9 }} className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 z-30 bg-white pt-20 px-6 md:hidden">
            <nav className="flex flex-col gap-4">
              {["Características", "Precios", "Cómo Funciona"].map((item, i) => (
                <Link key={item} href={`#${["features", "pricing", "how-it-works"][i]}`} className="text-sm font-medium text-[#2E2E2E] py-2" onClick={() => setMobileMenuOpen(false)}>{item}</Link>
              ))}
              <hr className="border-[#E5E5E5] my-2" />
              <Link href="/login" className="text-sm font-medium text-[#737373] py-2">Iniciar Sesión</Link>
              <Link href="/register" className="text-sm font-semibold text-white bg-[#2E2E2E] py-3 px-4 rounded text-center">Crear Cuenta</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="z-10 flex flex-col w-full relative pt-20">
        {/* HERO */}
        <section className="relative min-h-screen flex items-center justify-center px-6 md:px-12 overflow-hidden" style={{
          backgroundColor: `hsla(42,32%,86%,1)`,
          backgroundImage: `radial-gradient(circle at 50% 0%, hsla(42,32%,92%,1) 49.15975941515135%,transparent 102.23193813062571%)`,
          backgroundBlendMode: `normal`
        }}>
          <FloatingParticles />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="scale-150 opacity-30">
              <GlobeCanvas />
            </div>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8E1D4]/50 border border-[#E8E1D4] mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-[#2E2E2E]">Disponible en 200+ países</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-[#2E2E2E] leading-[0.95] mb-6">
              Envía SMS<br />
              <span className="text-[#737373]">al mundo</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg md:text-xl text-[#737373] max-w-xl mx-auto mb-10 leading-relaxed">
              Plataforma simple para enviar SMS internacionales. Sin suscripciones, sin complicaciones.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="#pricing" className="group inline-flex items-center gap-2 bg-[#2E2E2E] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#3E3E3E] transition-all hover:scale-105">
                Ver Precios
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a href="https://t.me/pedrobardaji" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-[#2E2E2E] border border-[#E5E5E5] hover:border-[#2E2E2E]/30 hover:bg-white transition-all">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Comprar por Telegram
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-8 mt-12 text-xs sm:text-sm text-[#737373]">
              <span>Próximamente la API</span>
              <span className="hidden sm:inline">•</span>
              <span>Entrega instantánea</span>
              <span className="hidden sm:inline">•</span>
              <span>Soporte 24/7</span>
            </motion.div>
          </div>
        </section>

        {/* Logo Strip */}
        <section className="border-y border-[#E5E5E5]/60 py-12 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <motion.div className="flex gap-12 items-center" animate={{ x: [0, -600, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}>
              {[
                { code: "cu", name: "Cuba" },
                { code: "us", name: "USA" },
                { code: "es", name: "España" },
                { code: "mx", name: "México" },
                { code: "co", name: "Colombia" },
                { code: "ar", name: "Argentina" },
                { code: "cl", name: "Chile" },
                { code: "pe", name: "Perú" },
                { code: "cu", name: "Cuba" },
                { code: "us", name: "USA" },
                { code: "es", name: "España" },
                { code: "mx", name: "México" },
              ].map((country, i) => (
                <div key={i} className="flex items-center gap-3 shrink-0">
                  <span className={`fi fi-${country.code} w-6 h-4 rounded-sm shadow-sm`}></span>
                  <span className="font-sans text-lg font-bold text-[#2E2E2E]/40 whitespace-nowrap">{country.name}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* STATS */}
        <section className="py-20 px-6 md:px-12 lg:px-20 bg-[#2E2E2E]">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: countriesCounter.count, suffix: "+", label: "Países", ref: countriesCounter.ref },
              { value: smsCounter.count, suffix: "+", label: "SMS Enviados", ref: smsCounter.ref },
              { value: usersCounter.count, suffix: "+", label: "Usuarios", ref: usersCounter.ref },
              { value: uptimeCounter.count, suffix: "%", label: "Uptime", ref: uptimeCounter.ref },
            ].map((stat, i) => (
              <div key={i} ref={stat.ref} className="text-center">
                <motion.div className="text-3xl md:text-4xl font-bold text-white mb-2" initial={{ scale: 0.5 }} whileInView={{ scale: 1 }} transition={{ delay: i * 0.1 }}>
                  {stat.value.toLocaleString()}{stat.suffix}
                </motion.div>
                <div className="text-sm text-[#E8E1D4]/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-24 px-6 md:px-12 lg:px-20 bg-[#FAFAFA] border-b border-[#E5E5E5]">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <span className="inline-block px-3 py-1 rounded-full bg-[#E8E1D4] text-[#2E2E2E] text-xs font-semibold mb-4">Características</span>
                <h2 className="font-sans text-3xl md:text-4xl font-semibold text-[#2E2E2E] tracking-tight mb-3">Todo lo que necesitas</h2>
                <p className="text-[#737373]">Herramientas simples y poderosas para enviar SMS</p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { emoji: "🌍", title: "Cobertura Global", desc: "Envía SMS a más de 200 países con tarifas competitivas y entrega confiable." },
                { emoji: "⚡", title: "Envío Instantáneo", desc: "Tus SMS se entregan en segundos. Sin demoras, sin complicaciones." },
                { emoji: "🔒", title: "Seguro y Privado", desc: "Tus mensajes y datos están protegidos. No compartimos información." },
                { emoji: "📊", title: "Historial Completo", desc: "Accede a tu historial de envíos, estados de entrega y estadísticas." },
                { emoji: "💰", title: "Sin Suscripción", desc: "Compra coins cuando los necesites. No hay cargos recurrentes ni contratos." },
                { emoji: "🎧", title: "Soporte Personal", desc: "Contacto directo por Telegram para resolver cualquier duda rápidamente." },
              ].map((feature, i) => (
                <ScrollReveal key={i} delay={0.1 * (i + 1)}>
                  <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 hover:border-[#2E2E2E] transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-[#E8E1D4] flex items-center justify-center mb-4">
                      <span className="text-lg">{feature.emoji}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#2E2E2E] mb-2">{feature.title}</h3>
                    <p className="text-sm text-[#737373]">{feature.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-24 px-6 md:px-12 lg:px-20 bg-[#E8E1D4]/10 border-b border-[#E5E5E5]">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <span className="inline-block px-3 py-1 rounded-full bg-[#2E2E2E] text-white text-xs font-semibold mb-4">Cómo Funciona</span>
                <h2 className="font-sans text-3xl md:text-4xl font-semibold text-[#2E2E2E] tracking-tight mb-3">En 3 simples pasos</h2>
                <p className="text-[#737373]">Comienza a enviar SMS en minutos</p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Crea tu cuenta", desc: "Regístrate gratis en segundos. Solo necesitas un email." },
                { step: "2", title: "Compra coins", desc: "Elige la cantidad que necesites. Desde $5 USD." },
                { step: "3", title: "Envía SMS", desc: "Escribe el número, el mensaje y envía. ¡Listo!" },
              ].map((item, i) => (
                <ScrollReveal key={i} delay={0.1 * (i + 1)}>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-[#2E2E2E] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">{item.step}</div>
                    <h3 className="text-lg font-semibold text-[#2E2E2E] mb-2">{item.title}</h3>
                    <p className="text-sm text-[#737373]">{item.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.4}>
              <div className="text-center mt-12">
                <Link href="/register" className="inline-flex items-center gap-2 bg-[#2E2E2E] text-white px-8 py-4 rounded-xl font-medium hover:bg-[#3E3E3E] transition-colors">
                  Crear cuenta gratis
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="py-32 px-6 md:px-12 lg:px-20 border-b border-[#E5E5E5] bg-linear-to-b from-[#FAFAFA] to-[#E8E1D4]/20">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-12">
                <span className="inline-block px-3 py-1 rounded-full bg-[#2E2E2E] text-white text-xs font-semibold mb-4">Precios Transparentes</span>
                <h2 className="font-sans text-3xl md:text-4xl font-semibold text-[#2E2E2E] tracking-tight mb-3">Simple y Directo</h2>
                <p className="text-[#737373]">Sin suscripciones. Sin contratos. Solo pagas lo que usas.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 text-center hover:border-[#2E2E2E] transition-colors">
                  <div className="text-3xl md:text-4xl font-bold text-[#2E2E2E] mb-1">100</div>
                  <div className="text-sm text-[#737373] mb-4">coins</div>
                  <div className="text-3xl font-bold text-[#2E2E2E] mb-4">$5 USD</div>
                  <a href="https://t.me/pedrobardaji?text=Hola, quiero comprar 100 coins ($5 USD)" target="_blank" rel="noopener noreferrer" className="block w-full py-2.5 bg-[#2E2E2E] text-white font-medium rounded-lg hover:bg-[#3E3E3E] transition-colors">Comprar</a>
                </div>

                <div className="bg-[#2E2E2E] rounded-2xl p-6 text-center relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E8E1D4] text-[#2E2E2E] text-xs font-bold px-3 py-1 rounded-full">POPULAR</div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">500</div>
                  <div className="text-sm text-gray-300 mb-4">coins</div>
                  <div className="text-3xl font-bold text-white mb-4">$20 USD</div>
                  <a href="https://t.me/pedrobardaji?text=Hola, quiero comprar 500 coins ($20 USD)" target="_blank" rel="noopener noreferrer" className="block w-full py-2.5 bg-white text-[#2E2E2E] font-medium rounded-lg hover:bg-gray-100 transition-colors">Comprar</a>
                </div>

                <div className="bg-white border-2 border-[#E8E1D4] rounded-2xl p-6 text-center relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E8E1D4] text-[#2E2E2E] text-xs font-bold px-3 py-1 rounded-full">MEJOR VALOR</div>
                  <div className="text-3xl md:text-4xl font-bold text-[#2E2E2E] mb-1">1,000</div>
                  <div className="text-sm text-[#737373] mb-4">coins</div>
                  <div className="text-3xl font-bold text-[#2E2E2E] mb-4">$35 USD</div>
                  <a href="https://t.me/pedrobardaji?text=Hola, quiero comprar 1,000 coins ($35 USD)" target="_blank" rel="noopener noreferrer" className="block w-full py-2.5 bg-[#E8E1D4] text-[#2E2E2E] font-medium rounded-lg hover:bg-[#d4ccc0] transition-colors">Comprar</a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-[#FAFAFA] pt-20 pb-10 px-6 md:px-12 lg:px-20 border-t border-[#E5E5E5]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
              <div className="lg:col-span-1 space-y-6">
                <div className="flex items-center gap-2">
                  <Image src="/isotipo.png" alt="SMS Número Virtual" width={24} height={24} className="h-6 w-auto" />
                  <span className="font-[family-name:var(--font-mona-sans)] font-bold text-sm tracking-tight text-[#2E2E2E]">SMS Número Virtual</span>
                </div>
                <p className="text-sm text-[#737373] leading-relaxed">Plataforma de envío de SMS internacionales. Servicio exclusivamente saliente - no se reciben respuestas.</p>
                <div className="flex items-center gap-3 pt-2">
                  {/* X (Twitter) */}
                  <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white border border-[#E5E5E5] flex items-center justify-center hover:bg-[#2E2E2E] hover:border-[#2E2E2E] hover:scale-110 group transition-all duration-200">
                    <svg className="w-4 h-4 text-[#737373] group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  {/* Facebook */}
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white border border-[#E5E5E5] flex items-center justify-center hover:bg-[#1877F2] hover:border-[#1877F2] hover:scale-110 group transition-all duration-200">
                    <svg className="w-4 h-4 text-[#737373] group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  {/* Telegram */}
                  <a href="https://t.me/smsnumerovirtual" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white border border-[#E5E5E5] flex items-center justify-center hover:bg-[#26A5E4] hover:border-[#26A5E4] hover:scale-110 group transition-all duration-200">
                    <svg className="w-4 h-4 text-[#737373] group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </a>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-[#2E2E2E]">Servicio</h4>
                <ul className="space-y-3 text-sm text-[#737373]">
                  <li><Link href="#features" className="hover:text-[#2E2E2E] transition-colors">Características</Link></li>
                  <li><Link href="#pricing" className="hover:text-[#2E2E2E] transition-colors">Precios</Link></li>
                  <li><Link href="#how-it-works" className="hover:text-[#2E2E2E] transition-colors">Cómo Funciona</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-[#2E2E2E]">Soporte</h4>
                <ul className="space-y-3 text-sm text-[#737373]">
                  <li><Link href="/faq" className="hover:text-[#2E2E2E] transition-colors">Preguntas Frecuentes</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-[#2E2E2E]">Legal</h4>
                <ul className="space-y-3 text-sm text-[#737373]">
                  <li><Link href="/terms" className="hover:text-[#2E2E2E] transition-colors">Términos de Servicio</Link></li>
                  <li><Link href="/privacy" className="hover:text-[#2E2E2E] transition-colors">Política de Privacidad</Link></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-[#E5E5E5] flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-[#737373]">© 2026 SMS Número Virtual. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
