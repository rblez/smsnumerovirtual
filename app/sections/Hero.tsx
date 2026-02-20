"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#E8E1D4] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 lg:pt-40 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/60 border border-[#2E2E2E]/10 mb-8">
              <span className="text-sm font-medium text-[#3E3E3E]">
                ✨ Envía SMS a más de 200 países
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2E2E2E] leading-tight mb-6">
              Envía SMS a cualquier parte del mundo
            </h1>

            <p className="text-lg sm:text-xl text-[#3E3E3E] mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              La forma más fácil de enviar SMS internacionales. 
              Compra créditos y envía mensajes de texto en segundos.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
              <Link
                href="/register"
                className="inline-flex items-center space-x-2 bg-[#2E2E2E] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#3E3E3E] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span>Comenzar ahora</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center space-x-2 bg-white text-[#2E2E2E] px-8 py-4 rounded-xl font-semibold hover:bg-[#F5F5F5] transition-all duration-200 border border-[#E8E1D4]"
              >
                <span>Ver cómo funciona</span>
              </a>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-[#2E2E2E]">200+</div>
                <div className="text-xs sm:text-sm text-[#3E3E3E] mt-1">Países</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-[#2E2E2E]">0.05$</div>
                <div className="text-xs sm:text-sm text-[#3E3E3E] mt-1">Desde</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-[#2E2E2E]">24/7</div>
                <div className="text-xs sm:text-sm text-[#3E3E3E] mt-1">Soporte</div>
              </div>
            </div>
          </div>

          {/* Right Content - Phone Mockup */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-sm">
              <div className="relative bg-[#2E2E2E] rounded-[3rem] p-4 shadow-2xl">
                <div className="bg-white rounded-[2.5rem] overflow-hidden">
                  <div className="p-6 space-y-4">
                    <div className="flex justify-end">
                      <div className="bg-[#E8E1D4] rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                        <p className="text-sm text-[#2E2E2E]">Hola, ¿cómo estás?</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-[#F5F5F5] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                        <p className="text-sm text-[#3E3E3E]">¡Todo bien!</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-[#E8E1D4] rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                        <p className="text-sm text-[#2E2E2E]">Te envío los detalles 📱</p>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <span className="text-xs text-gray-400">Enviado • Justo ahora</span>
                    </div>
                  </div>
                </div>
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-6 bg-[#2E2E2E] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
