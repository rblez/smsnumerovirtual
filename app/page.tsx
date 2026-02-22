"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useSpring, useInView } from "framer-motion";
import { SFIcon } from '@bradleyhodges/sfsymbols-react'
import { 
  sfChevronRight, 
  sfGlobe,
  sfBubbleLeft,
  sfBolt,
  sfLock,
  sfChartBar,
  sfDollarsignCircle,
  sfMessage,
  sfPerson,
  sfCart
} from '@bradleyhodges/sfsymbols'
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
          className="absolute w-2 h-2 bg-[var(--color-secondary)]/40 rounded-full"
          style={{ left: p.left, top: p.top }}
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3], scale: [1, 1.5, 1] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
        />
      ))}
    </div>
  );
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
  const [scrollY, setScrollY] = useState(0);
  const [user, setUser] = useState<{ id: string; full_name?: string; email?: string; credits_balance?: number } | null>(null);
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

  return (
    <div ref={containerRef} className="w-full relative bg-white overflow-x-hidden">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#2E2E2E] z-50 origin-left" style={{ scaleX: springScroll }} />
      
      <motion.header initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6 }} className={`fixed top-0 left-0 right-0 z-40 w-full px-6 py-5 md:px-12 flex justify-between items-center backdrop-blur-md border-b border-[var(--color-secondary)]/30 transition-all ${scrollY > 50 ? "bg-white/90 shadow-sm" : "bg-white/90"}`}>
        <Link href="/" className="flex items-center gap-3 z-10">
          <Image src="/isotipo.png" alt="SMS Número Virtual" width={48} height={48} className="h-12 w-auto" />
          <span className="text-lg font-bold text-[#2E2E2E] hidden sm:block">
              SMS Número Virtual
            </span>
        </Link>
        
        {/* Mobile: centered site name - HIDDEN to prevent overlap */}
        {/* <span className="md:hidden absolute left-1/2 -translate-x-1/2 text-sm font-bold tracking-tight text-[#2E2E2E] pointer-events-none">
          SMS Número Virtual
        </span> */}
        
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "CARACTERÍSTICAS", href: "#features" },
            { label: "PRECIOS", href: "#pricing" },
            { label: "GUÍA", href: "#how-it-works" },
            { label: "FAQ", href: "/faq" },
            { label: "CONTACTO", href: "https://t.me/pedrobardaji" },
          ].map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
              <Link href={item.href} className="font-mono text-[11px] font-medium text-[#737373] hover:text-[#2E2E2E] transition-colors relative group tracking-wider">
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2E2E2E] transition-all group-hover:w-full" />
              </Link>
            </motion.div>
          ))}
        </nav>
        
        <div className="flex items-center gap-5">
          {user ? (
            <Link 
              href={`/~/${user.id}`}
              className="w-9 h-9 rounded-full bg-[#2E2E2E] text-white flex items-center justify-center text-sm font-bold hover:bg-[#3E3E3E] transition-colors"
            >
              {user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
            </Link>
          ) : (
            <>
              {/* Desktop only buttons */}
              <Link href="/login" className="hidden md:block font-mono text-xs font-medium text-[#737373] hover:text-[#2E2E2E]">Iniciar Sesión</Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden md:block">
                <Link href="/register" className="bg-[#2E2E2E] text-white font-mono text-xs font-semibold px-6 py-2.5 rounded shadow-lg shadow-[#2E2E2E]/20 hover:shadow-xl">Crear Cuenta</Link>
              </motion.div>
              {/* Mobile: show login/register buttons */}
              <div className="flex items-center gap-2 md:hidden">
                <Link href="/login" className="text-xs font-medium text-[#737373] hover:text-[#2E2E2E]">Acceder</Link>
                <Link href="/register" className="bg-[#2E2E2E] text-white text-xs font-semibold px-3 py-1.5 rounded">Crear Cuenta</Link>
              </div>
            </>
          )}
        </div>
      </motion.header>

      <div className="z-10 flex flex-col w-full relative pt-20">
        {/* HERO */}
        <section className="relative min-h-screen flex items-center justify-center px-6 md:px-12 overflow-hidden bg-white">
          <FloatingParticles />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="scale-150 opacity-30">
              <GlobeCanvas />
            </div>
          </div>
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-secondary)]/50 border border-[var(--color-secondary)] mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[11px] tracking-wider uppercase text-[#2E2E2E]">Disponible en 200+ países</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[90px] font-normal tracking-[-0.02em] text-[#2E2E2E] leading-[1.1] mb-8">
              Envía SMS
              <span className="block text-[#737373]">a cualquier lugar</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="font-sans text-lg md:text-xl text-[#737373] max-w-2xl mx-auto mb-10 leading-relaxed tracking-[-0.01em]">
              Plataforma simple para enviar SMS internacionales. Sin suscripciones, sin complicaciones — solo escribe, envía y llega.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                // User is logged in
                (user.credits_balance && user.credits_balance > 0) ? (
                  // Has credits - go to dashboard
                  <Link 
                    href={`/~/${user.id}`}
                    className="group inline-flex items-center gap-2 bg-[#2E2E2E] text-white px-10 py-4 rounded-full font-mono text-xs tracking-wider uppercase hover:bg-[#3E3E3E] transition-all"
                  >
                    Enviar SMS
                    <SFIcon icon={sfChevronRight} size={14} color="white" />
                  </Link>
                ) : (
                  // No credits - go to pricing
                  <Link 
                    href="#pricing" 
                    className="group inline-flex items-center gap-2 bg-[#2E2E2E] text-white px-10 py-4 rounded-full font-mono text-xs tracking-wider uppercase hover:bg-[#3E3E3E] transition-all"
                  >
                    Comprar Coins
                    <SFIcon icon={sfChevronRight} size={14} color="white" />
                  </Link>
                )
              ) : (
                // Not logged in - go to register
                <Link 
                  href="/register" 
                  className="group inline-flex items-center gap-2 bg-[#2E2E2E] text-white px-10 py-4 rounded-full font-mono text-xs tracking-wider uppercase hover:bg-[#3E3E3E] transition-all"
                >
                  Comenzar Ahora
                  <SFIcon icon={sfChevronRight} size={14} color="white" />
                </Link>
              )}
              <Link href="/faq" className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-mono text-xs tracking-wider uppercase text-[#2E2E2E] border border-[#E5E5E5] hover:border-[#2E2E2E] transition-all">
                Saber Más
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }} className="mt-12 flex flex-col items-center gap-3">
              <div className="flex items-center gap-1 text-xs font-mono tracking-wider uppercase">
                <span className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-linear-to-br from-gray-200 to-gray-300 border-2 border-white flex items-center justify-center text-[10px] font-mono text-gray-600">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </span>
                <span className="ml-3">+500 usuarios activos</span>
              </div>
              <p className="text-[10px] font-mono tracking-wider uppercase">
                Cuba • USA • España • México • +190 países
              </p>
            </motion.div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-24 px-6 md:px-12 lg:px-20 bg-white border-b border-[var(--color-secondary)]">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-20">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-secondary)] text-[var(--color-primary)] font-mono text-[10px] tracking-wider uppercase mb-6">Características</span>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal text-[#2E2E2E] tracking-[-0.02em] leading-[1.1] mb-6">Todo lo que necesitas</h2>
                <p className="font-sans text-lg text-[#737373] max-w-xl mx-auto tracking-[-0.01em]">Herramientas diseñadas para la simplicidad y efectividad</p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: sfGlobe, title: "Cobertura Global", desc: "Envía SMS a más de 200 países con tarifas competitivas y entrega confiable." },
                { icon: sfBolt, title: "Entrega Rápida", desc: "Tus mensajes se entregan en segundos gracias a nuestra infraestructura optimizada." },
                { icon: sfLock, title: "Privacidad Total", desc: "Tus datos están protegidos. Nunca vendemos ni compartimos tu información." },
                { icon: sfChartBar, title: "Control Completo", desc: "Historial de envíos, estados de entrega y estadísticas en tiempo real." },
                { icon: sfDollarsignCircle, title: "Sin Suscripciones", desc: "Compra coins cuando los necesites. Sin cargos recurrentes ni contratos." },
                { icon: sfMessage, title: "Soporte Real", desc: "Contacto directo por Telegram. Personas reales, no bots." },
              ].map((feature, i) => (
                <ScrollReveal key={i} delay={0.1 * (i + 1)}>
                  <div className="bg-white border border-[var(--color-secondary)] rounded-2xl p-8 hover:border-[var(--color-primary)] transition-all duration-300 hover:shadow-lg">
                    <div className="w-12 h-12 rounded-xl bg-(--color-secondary) flex items-center justify-center mb-6">
                      <SFIcon icon={feature.icon} size={26} color="#2E2E2E" />
                    </div>
                    <h3 className="font-display text-xl text-[#2E2E2E] tracking-[-0.01em] mb-3">{feature.title}</h3>
                    <p className="font-sans text-sm text-[#737373] leading-relaxed tracking-[-0.01em]">{feature.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-24 px-6 md:px-12 lg:px-20 bg-[var(--color-secondary)]/10 border-b border-[var(--color-secondary)]">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-20">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#2E2E2E] text-white font-mono text-[10px] tracking-wider uppercase mb-6">Guía</span>
                <h2 className="font-display text-4xl md:text-5xl font-normal text-[#2E2E2E] tracking-[-0.02em] leading-[1.1] mb-6">Guía Completa del Sitio</h2>
                <p className="font-sans text-lg text-[#737373] tracking-[-0.01em]">Todo lo que necesitas saber para usar SMS Número Virtual</p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { step: "1", icon: sfPerson, title: "Registro", desc: "Crea tu cuenta gratuita con email. Verificación instantánea." },
                { step: "2", icon: sfCart, title: "Comprar Coins", desc: "Adquiere créditos desde $5 USD. Pago seguro y directo." },
                { step: "3", icon: sfBubbleLeft, title: "Enviar SMS", desc: "Elige país, escribe mensaje y envía. Entrega inmediata." },
                { step: "4", icon: sfChartBar, title: "Historial", desc: "Revisa todos tus envíos, estados de entrega y estadísticas." },
                { step: "5", icon: sfLock, title: "Privacidad", desc: "Tus datos están protegidos. Nunca compartimos información." },
                { step: "6", icon: sfMessage, title: "Soporte", desc: "Contacto directo por Telegram. Ayuda personalizada." },
              ].map((item, i) => (
                <ScrollReveal key={i} delay={0.1 * (i + 1)}>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-[#2E2E2E] text-white flex items-center justify-center mx-auto mb-6">
                      <SFIcon icon={item.icon} size={28} color="white" />
                    </div>
                    <h3 className="font-display text-xl text-[#2E2E2E] tracking-[-0.01em] mb-3">{item.title}</h3>
                    <p className="font-sans text-sm text-[#737373] leading-relaxed tracking-[-0.01em]">{item.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.4}>
              <div className="text-center mt-16">
                <Link href="/register" className="inline-flex items-center gap-2 bg-[#2E2E2E] text-white px-10 py-4 rounded-full font-mono text-xs tracking-wider uppercase hover:bg-[#3E3E3E] transition-all">
                  Crear cuenta gratis
                  <SFIcon icon={sfChevronRight} size={14} color="white" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="py-32 px-6 md:px-12 lg:px-20 border-b border-[var(--color-secondary)] bg-linear-to-b from-white to-[var(--color-secondary)]/20">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#2E2E2E] text-white font-mono text-[10px] tracking-wider uppercase mb-6">Precios Transparentes</span>
                <h2 className="font-display text-4xl md:text-5xl font-normal text-[#2E2E2E] tracking-[-0.02em] leading-[1.1] mb-6">Simple y Directo</h2>
                <p className="font-sans text-lg text-[#737373] tracking-[-0.01em]">Sin suscripciones. Sin contratos. Solo pagas lo que usas.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-(--color-secondary) rounded-2xl p-8 text-center hover:border-(--color-primary) transition-all duration-300 hover:shadow-lg">
                  <div className="font-display text-4xl md:text-5xl font-normal text-[#2E2E2E] tracking-[-0.02em] mb-2">100</div>
                  <div className="font-mono text-xs tracking-wider text-[#737373] uppercase mb-6">coins</div>
                  <div className="font-display text-3xl font-normal text-[#2E2E2E] tracking-[-0.01em] mb-6">$5 USD</div>
                  <a href="https://t.me/pedrobardaji?text=Hola, quiero comprar 100 coins ($5 USD)" target="_blank" rel="noopener noreferrer" className="block w-full py-3 bg-[#2E2E2E] text-white font-mono text-xs tracking-wider uppercase rounded-full hover:bg-[#3E3E3E] transition-colors">Comprar</a>
                </div>
                <div className="bg-white border border-(--color-secondary) rounded-2xl p-8 text-center hover:border-(--color-primary) transition-all duration-300 hover:shadow-lg relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#2E2E2E] text-white font-mono text-[10px] tracking-wider uppercase rounded-full">Popular</div>
                  <div className="font-display text-4xl md:text-5xl font-normal text-[#2E2E2E] tracking-[-0.02em] mb-2">500</div>
                  <div className="font-mono text-xs tracking-wider text-[#737373] uppercase mb-6">coins</div>
                  <div className="font-display text-3xl font-normal text-[#2E2E2E] tracking-[-0.01em] mb-6">$25 USD</div>
                  <a href="https://t.me/pedrobardaji?text=Hola, quiero comprar 500 coins ($25 USD)" target="_blank" rel="noopener noreferrer" className="block w-full py-3 bg-[#2E2E2E] text-white font-mono text-xs tracking-wider uppercase rounded-full hover:bg-[#3E3E3E] transition-colors">Comprar</a>
                </div>
                <div className="bg-white border border-(--color-secondary) rounded-2xl p-8 text-center hover:border-(--color-primary) transition-all duration-300 hover:shadow-lg">
                  <div className="font-display text-4xl md:text-5xl font-normal text-[#2E2E2E] tracking-[-0.02em] mb-2">1,000</div>
                  <div className="font-mono text-xs tracking-wider text-[#737373] uppercase mb-6">coins</div>
                  <div className="font-display text-3xl font-normal text-[#2E2E2E] tracking-[-0.01em] mb-6">$50 USD</div>
                  <a href="https://t.me/pedrobardaji?text=Hola, quiero comprar 1,000 coins ($35 USD)" target="_blank" rel="noopener noreferrer" className="block w-full py-3 bg-[#2E2E2E] text-white font-mono text-xs tracking-wider uppercase rounded-full hover:bg-[#3E3E3E] transition-colors">Comprar</a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 px-6 md:px-12 lg:px-20 bg-[var(--color-secondary)]/10 border-b border-[var(--color-secondary)]">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-20">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-secondary)] text-[var(--color-primary)] font-mono text-[10px] tracking-wider uppercase mb-6">Testimonios</span>
                <h2 className="font-display text-4xl md:text-5xl font-normal text-[#2E2E2E] tracking-[-0.02em] leading-[1.1] mb-6">Lo que dicen nuestros usuarios</h2>
                <p className="font-sans text-lg text-[#737373] tracking-[-0.01em]">Historias reales de personas que confían en nosotros</p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Carlos M.", country: "Cuba", text: "La única plataforma que funciona consistentemente para enviar SMS a Cuba. Rápida, confiable y sin complicaciones.", role: "Empresario" },
                { name: "María L.", country: "España", text: "Uso SMS Número Virtual para comunicarme con mi familia en Latinoamérica. El sistema de coins es perfecto, pago solo cuando necesito.", role: "Estudiante" },
                { name: "Pedro R.", country: "USA", text: "He probado muchos servicios y este es el más directo. No hay suscripciones ocultas, no hay sorpresas. Funciona.", role: "Desarrollador" },
              ].map((testimonial, i) => (
                <ScrollReveal key={i} delay={0.1 * (i + 1)}>
                  <div className="bg-white border border-[var(--color-secondary)] rounded-2xl p-8 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center text-lg font-display text-gray-600">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-display text-lg text-[#2E2E2E] tracking-[-0.01em]">{testimonial.name}</h4>
                        <p className="font-mono text-[10px] tracking-wider text-[#737373] uppercase">{testimonial.role} • {testimonial.country}</p>
                      </div>
                    </div>
                    <p className="font-sans text-sm text-[#737373] leading-relaxed tracking-[-0.01em]">&ldquo;{testimonial.text}&rdquo;</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 px-6 md:px-12 lg:px-20 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal text-[#2E2E2E] tracking-[-0.02em] leading-[1.1] mb-6">
                ¿Listo para enviar tu primer SMS?
              </h2>
              <p className="font-sans text-lg text-[#737373] mb-10 max-w-2xl mx-auto tracking-[-0.01em]">
                Únete a cientos de usuarios que ya confían en nosotros. Regístrate gratis y comienza a enviar mensajes en minutos.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register" className="inline-flex items-center gap-2 bg-[#2E2E2E] text-white px-10 py-4 rounded-full font-mono text-xs tracking-wider uppercase hover:bg-[#3E3E3E] transition-all">
                  Crear Cuenta Gratis
                  <SFIcon icon={sfChevronRight} size={14} color="white" />
                </Link>
                <Link href="#pricing" className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-mono text-xs tracking-wider uppercase text-[#2E2E2E] border border-[#2E2E2E]/30 hover:border-[#2E2E2E] transition-all">
                  Ver Precios
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8 px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 mb-12 mt-8 ml-8 lg:ml-16">
              {/* Brand Section */}
              <div className="shrink-0 space-y-6 pr-8">
                <div className="flex items-center gap-3">
                  <Image src="/isotipo.png" alt="SMS Número Virtual" width={32} height={32} className="h-8 w-auto" />
                </div>
                <p className="text-gray-600 leading-relaxed max-w-md">
                  Envío confiable de SMS internacionales a más de 200 países.
                </p>
              </div>

              {/* Services Section */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Servicio */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider" style={{ fontFamily: 'BerkeleyMono, monospace' }}>Servicio</h4>
                  <ul className="space-y-3">
                    <li><Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Características</Link></li>
                    <li><Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Precios</Link></li>
                    <li><Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Guía</Link></li>
                  </ul>
                </div>

                {/* Soporte */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider" style={{ fontFamily: 'BerkeleyMono, monospace' }}>Soporte</h4>
                  <ul className="space-y-3">
                    <li><Link href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Preguntas Frecuentes</Link></li>
                    <li><Link href="https://t.me/pedrobardaji" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Contactanos</Link></li>
                  </ul>
                </div>

                {/* Legal */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wider" style={{ fontFamily: 'BerkeleyMono, monospace' }}>Legal</h4>
                  <ul className="space-y-3">
                    <li><Link href="/terms-of-service" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Términos de Servicio</Link></li>
                    <li><Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Políticas de Privacidad</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">© 2026 SMS Número Virtual. Todos los derechos reservados.</p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <a href="https://t.me/smsnumerovirtual" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </a>
                </div>
                <span className="text-gray-300">|</span>
                {/* Language Selector */}
                <div className="relative">
                  <p className="text-gray-500 text-sm">Español</p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
