import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos de Servicio - SMS Número Virtual",
  description: "Términos y condiciones de uso de SMS Número Virtual. Lee nuestras políticas antes de usar el servicio.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <Link href="/" className="font-mono text-xs tracking-wider uppercase text-[#737373] hover:text-[#2E2E2E] mb-12 inline-block">
          ← Volver al inicio
        </Link>
        
        <h1 className="font-display text-4xl md:text-5xl font-normal text-[#2E2E2E] tracking-[-0.02em] leading-[1.1] mb-12">Términos de Servicio</h1>
        
        <div className="space-y-10">
          <section>
            <h2 className="font-display text-xl text-[#2E2E2E] tracking-[-0.01em] mb-4">1. Aceptación de los Términos</h2>
            <p className="font-sans text-base text-[#737373] leading-relaxed tracking-[-0.01em]">
              Al acceder y utilizar SMS Número Virtual, aceptas estar sujeto a estos términos y condiciones. 
              Si no estás de acuerdo con alguna parte de estos términos, no podrás utilizar nuestro servicio.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-[#2E2E2E] tracking-[-0.01em] mb-4">2. Descripción del Servicio</h2>
            <p className="font-sans text-base text-[#737373] leading-relaxed tracking-[-0.01em] mb-4">
              SMS Número Virtual es una plataforma de envío de SMS internacionales. Nuestro servicio permite:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-sans text-base text-[#737373] leading-relaxed tracking-[-0.01em]">
              <li>Enviar SMS a números de teléfono en más de 200 países</li>
              <li>Comprar coins para utilizar como crédito de envío</li>
              <li>Consultar historial de mensajes enviados</li>
            </ul>
            <p className="font-sans text-base text-[#737373] leading-relaxed tracking-[-0.01em] mt-4">
              <strong className="text-[#2E2E2E]">Importante:</strong> Este servicio es exclusivamente para envío de SMS salientes. 
              No proporcionamos números virtuales ni podemos recibir respuestas.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-[#2E2E2E] tracking-[-0.01em] mb-4">3. Sistema de Coins</h2>
            <p className="font-sans text-base text-[#737373] leading-relaxed tracking-[-0.01em] mb-4">
              Los coins son la moneda virtual de nuestra plataforma. Cada SMS consume una cantidad de coins 
              según el país de destino:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-sans text-base text-[#737373] leading-relaxed tracking-[-0.01em]">
              <li>Cuba, USA, Canadá: 1 coin por SMS</li>
              <li>México, España, y otros países seleccionados: 2 coins por SMS</li>
              <li>Resto del mundo: 3 coins por SMS</li>
            </ul>
            <p className="font-sans text-base text-[#737373] leading-relaxed tracking-[-0.01em] mt-4">
              Los coins no tienen fecha de vencimiento y no son reembolsables.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-[#2E2E2E] tracking-[-0.01em] mb-4">4. Prohibiciones</h2>
            <p className="font-sans text-base text-[#737373] leading-relaxed tracking-[-0.01em] mb-4">Está estrictamente prohibido utilizar el servicio para:</p>
            <ul className="list-disc pl-6 space-y-2 font-sans text-base text-[#737373] leading-relaxed tracking-[-0.01em]">
              <li>Enviar spam o mensajes no solicitados</li>
              <li>Cometer fraude o estafa</li>
              <li>Enviar contenido ilegal, amenazante o abusivo</li>
              <li>Violar la privacidad de terceros</li>
              <li>Usar el servicio para fines comerciales no autorizados</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-[#2E2E2E] tracking-[-0.01em] mb-4">5. Limitaciones de Responsabilidad</h2>
            <p className="font-sans text-base text-[#737373] leading-relaxed tracking-[-0.01em]">
              No garantizamos la entrega de todos los SMS enviados. Factores como la red del destinatario, 
              bloqueos de operadoras o números inválidos pueden impedir la entrega. No nos hacemos responsables 
              por mensajes no entregados debido a estos factores externos.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-[#2E2E2E] tracking-[-0.01em] mb-4">6. Modificaciones</h2>
            <p className="font-sans text-base text-[#737373] leading-relaxed tracking-[-0.01em]">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. 
              Los cambios entrarán en vigor inmediatamente después de su publicación.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-[#2E2E2E] tracking-[-0.01em] mb-4">7. Contacto</h2>
            <p className="font-sans text-base text-[#737373] leading-relaxed tracking-[-0.01em]">
              Para cualquier consulta sobre estos términos, contáctanos por Telegram:{' '}
              <a href="https://t.me/pedrobardaji" target="_blank" rel="noopener noreferrer" className="tracking-wider text-[#2E2E2E] underline">
                @pedrobardaji
              </a>
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-[#E5E5E5] text-center">
          <p className="text-[10px] tracking-wide text-[#A0A0A0]">
            © 2026 SMS Número Virtual. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>

  );
}
