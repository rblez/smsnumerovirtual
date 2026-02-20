"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "¿Qué es SMS Número Virtual?",
    answer: "SMS Número Virtual es una plataforma que te permite enviar SMS a cualquier número de teléfono en más de 200 países. Utilizamos un sistema de coins (créditos) que compras y luego usas para enviar mensajes."
  },
  {
    question: "¿Cómo funcionan los coins?",
    answer: "Los coins son nuestra moneda virtual. Cada SMS consume una cantidad de coins según el país de destino: Cuba y USA cuestan 1 coin, México y España cuestan 2 coins, y otros países cuestan 3 coins. Los coins no tienen vencimiento."
  },
  {
    question: "¿Cómo compro coins?",
    answer: "Para comprar coins, contáctanos por Telegram a @pedrobardaji. Aceptamos transferencias bancarias y criptomonedas. Una vez confirmado el pago, acreditamos los coins en tu cuenta manualmente."
  },
  {
    question: "¿Puedo recibir respuestas a mis SMS?",
    answer: "No. Nuestro servicio es exclusivamente para envío de SMS salientes. No proporcionamos números virtuales ni podemos recibir respuestas. El destinatario verá un número de origen genérico."
  },
  {
    question: "¿Cuánto tarda en llegar un SMS?",
    answer: "La mayoría de los SMS se entregan en segundos. Sin embargo, el tiempo de entrega puede variar según la red del destinatario y el país. Puedes verificar el estado de entrega en tu historial."
  },
  {
    question: "¿Qué pasa si un SMS no se entrega?",
    answer: "Si un SMS no se entrega debido a un número inválido o problema de red, los coins NO se te devuelven automáticamente. Te recomendamos verificar los números antes de enviar. En casos de error técnico por nuestra parte, podemos reembolsar manualmente."
  },
  {
    question: "¿Cuál es el límite de caracteres por SMS?",
    answer: "Cada SMS parte puede contener hasta 160 caracteres. Si tu mensaje excede los 160 caracteres, se dividirá en múltiples partes y se cobrará cada parte por separado (máximo 3 partes = 480 caracteres)."
  },
  {
    question: "¿Es seguro usar SMS Número Virtual?",
    answer: "Sí. Utilizamos encriptación para proteger tus datos y no compartimos tu información con terceros. Tu historial de mensajes es privado y solo tú puedes acceder a él."
  },
  {
    question: "¿Puedo enviar SMS masivos?",
    answer: "Para evitar spam, tenemos un límite de 10 SMS por minuto por usuario. Si necesitas enviar volúmenes mayores para fines legítimos (marketing, notificaciones), contáctanos para evaluar tu caso."
  },
  {
    question: "¿Cómo elimino mi cuenta?",
    answer: "Para eliminar tu cuenta y todos tus datos, contáctanos por Telegram. Procesaremos tu solicitud en un plazo de 30 días. Ten en cuenta que los coins no utilizados no son reembolsables."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-[#737373] hover:text-[#2E2E2E] mb-8 inline-block">
          ← Volver al inicio
        </Link>
        
        <h1 className="text-3xl font-bold text-[#2E2E2E] mb-4">Preguntas Frecuentes</h1>
        <p className="text-[#737373] mb-12">
          Respuestas a las dudas más comunes sobre nuestro servicio.
        </p>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-[#FAFAFA] transition-colors"
              >
                <span className="font-semibold text-[#2E2E2E] pr-4">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-[#737373] shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5">
                  <p className="text-[#737373] leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-[#E8E1D4]/30 rounded-xl border border-[#E8E1D4]">
          <h3 className="font-semibold text-[#2E2E2E] mb-2">¿No encontraste tu respuesta?</h3>
          <p className="text-[#737373] text-sm mb-4">
            Contáctanos directamente por Telegram y te responderemos lo antes posible.
          </p>
          <a 
            href="https://t.me/pedrobardaji" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2E2E2E] text-white rounded-lg text-sm hover:bg-[#3E3E3E] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Contactar por Telegram
          </a>
        </div>
      </div>
    </div>
  );
}
