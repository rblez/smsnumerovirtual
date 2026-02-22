"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SFIcon } from '@bradleyhodges/sfsymbols-react'
import { sfChevronDown } from '@bradleyhodges/sfsymbols'

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    question: "¿Qué es SMS Número Virtual?",
    answer: "SMS Número Virtual es una plataforma que permite enviar SMS internacionales a más de 200 países sin necesidad de tener un número físico. Es ideal para empresas que necesitan enviar notificaciones, verificaciones o comunicaciones masivas de manera confiable y económica.",
    category: "general"
  },
  {
    question: "¿Cómo funciona el servicio?",
    answer: "Es muy simple: 1) Regístrate gratis, 2) Compra coins según tus necesidades, 3) Elige el número de destino, escribe tu mensaje y envíalo. El SMS se entrega instantáneamente en la mayoría de los países.",
    category: "general"
  },
  {
    question: "¿Puedo recibir respuestas a mis SMS?",
    answer: "No, nuestro servicio es exclusivamente para envío saliente. No proporcionamos números para recepción de SMS. Si necesitas recibir respuestas, deberás usar otros servicios especializados.",
    category: "general"
  },
  {
    question: "¿Cuánto cuesta enviar un SMS?",
    answer: "Los precios varían según el país destino. La mayoría de los países de América Latina cuestan 1 coin por SMS, mientras que Europa y otros continentes pueden costar hasta 3 coins. Puedes ver los precios detallados en nuestra sección de precios.",
    category: "pricing"
  },
  {
    question: "¿Qué son los coins y cómo los compro?",
    answer: "Los coins son nuestra moneda virtual. Puedes comprarlos en paquetes desde $5 USD (100 coins) hasta $35 USD (1,000 coins). Los coins no expiran y puedes usarlos cuando necesites.",
    category: "pricing"
  },
  {
    question: "¿Hay costos ocultos o suscripciones?",
    answer: "No hay suscripciones mensuales ni costos ocultos. Solo pagas por los coins que compras y los SMS que envías. No hay tarifas de mantenimiento, configuración o envío mínimo.",
    category: "pricing"
  },
  {
    question: "¿Cuál es el tiempo de entrega de los SMS?",
    answer: "La entrega es casi instantánea en la mayoría de los países. En algunos casos remotos puede tomar hasta 5 minutos, pero generalmente los SMS llegan en menos de 30 segundos.",
    category: "delivery"
  },
  {
    question: "¿Qué pasa si un SMS no se entrega?",
    answer: "Si un SMS no se puede entregar (por ejemplo, número inexistente o fuera de servicio), no se cobra. Solo pagas por SMS entregados exitosamente.",
    category: "delivery"
  },
  {
    question: "¿A cuántos países puedo enviar SMS?",
    answer: "Puedes enviar SMS a más de 200 países incluyendo Cuba, Estados Unidos, México, España, Colombia, Argentina, Perú, Chile y muchos más países de América, Europa, Asia y África.",
    category: "delivery"
  },
  {
    question: "¿Es seguro usar el servicio?",
    answer: "Sí, completamente seguro. Usamos encriptación SSL/TLS para todas las comunicaciones, almacenamos datos de manera segura y cumplimos con las normativas de protección de datos. Nunca compartimos tu información con terceros.",
    category: "security"
  },
  {
    question: "¿Qué tipos de contenido puedo enviar?",
    answer: "Puedes enviar cualquier contenido de texto, incluyendo códigos de verificación, notificaciones, recordatorios, promociones, etc. No hay restricciones de contenido siempre que sea legal y no viole nuestras políticas de uso.",
    category: "content"
  },
  {
    question: "¿Hay límite de caracteres por SMS?",
    answer: "Sí, el límite estándar es 160 caracteres por SMS. Si envías mensajes más largos, se dividirán automáticamente en múltiples SMS (hasta 3 partes) y se cobrarán por separado.",
    category: "content"
  },
  {
    question: "¿Cómo creo mi cuenta?",
    answer: "Crear una cuenta es gratis y toma menos de 1 minuto. Solo necesitas proporcionar tu email y crear una contraseña. No pedimos información adicional para mantener la privacidad.",
    category: "account"
  },
  {
    question: "¿Puedo tener múltiples cuentas?",
    answer: "Sí, puedes crear múltiples cuentas si lo necesitas, pero recomendamos usar una sola cuenta para mejor organización de tu historial y facturación.",
    category: "account"
  },
  {
    question: "¿Cómo recupero mi contraseña?",
    answer: "En la página de login, haz clic en '¿Olvidaste tu contraseña?' y sigue las instrucciones. Te enviaremos un enlace de recuperación a tu email registrado.",
    category: "account"
  }
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-[var(--color-secondary)]">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-16">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-3 mb-8">
              <Image src="/isotipo.png" alt="SMS Número Virtual" width={40} height={40} className="h-10 w-auto" />
              <span className="text-2xl font-bold text-[#2E2E2E]">SMS Número Virtual</span>
            </Link>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal text-[#2E2E2E] tracking-[-0.02em] leading-[1.1] mb-6">
              Preguntas Frecuentes
            </h1>
            <p className="font-sans text-lg md:text-xl text-[#737373] max-w-2xl mx-auto tracking-[-0.01em]">
              Encuentra respuestas a las preguntas más comunes sobre nuestro servicio de SMS internacionales
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
        <div className="space-y-3 md:space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl md:rounded-2xl border border-(--color-secondary) overflow-hidden hover:border-[#2E2E2E]/20 transition-colors shadow-sm">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-4 py-4 md:px-6 md:py-5 text-left flex items-center justify-between hover:bg-(--color-secondary)/30 transition-colors"
              >
                <h3 className="font-display text-base md:text-lg lg:text-xl text-[#2E2E2E] tracking-[-0.01em] pr-4 leading-snug">
                  {faq.question}
                </h3>
                <SFIcon
                  icon={sfChevronDown}
                  size={18}
                  color="#737373"
                  className={`transform transition-transform duration-300 shrink-0 ${
                    openItems.has(index) ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openItems.has(index) && (
                <div className="px-4 pb-4 md:px-6 md:pb-5 border-t border-(--color-secondary)">
                  <p className="font-sans text-sm md:text-base text-[#737373] leading-relaxed tracking-[-0.01em] pt-3 md:pt-4">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © 2026 SMS Número Virtual. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/terms-of-service" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
                Términos de Servicio
              </Link>
              <Link href="/privacy-policy" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
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
