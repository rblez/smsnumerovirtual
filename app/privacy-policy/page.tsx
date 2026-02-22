import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad - SMS Número Virtual",
  description: "Política de privacidad de SMS Número Virtual. Conoce cómo protegemos tus datos personales.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <Link href="/" className="font-mono text-xs tracking-wider uppercase text-[#737373] hover:text-[#2E2E2E] mb-12 inline-block">
          ← Volver al inicio
        </Link>
        
        <h1 className="font-display text-4xl md:text-5xl font-normal text-[#2E2E2E] tracking-[-0.02em] leading-[1.1] mb-12">Política de Privacidad</h1>
        
        <div className="space-y-10">
          <section>
            <h2 className="font-display text-xl text-[#2E2E2E] tracking-[-0.01em] mb-4">1. Información que Recopilamos</h2>
            <p className="font-sans text-base text-[#737373] leading-relaxed tracking-[-0.01em] mb-4">
              Recopilamos la siguiente información cuando utilizas nuestro servicio:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-sans text-base text-[#737373] leading-relaxed tracking-[-0.01em]">
              <li><strong className="text-[#2E2E2E]">Información de cuenta:</strong> nombre, email, número de teléfono</li>
              <li><strong className="text-[#2E2E2E]">Información de uso:</strong> historial de SMS enviados, balance de coins</li>
              <li><strong className="text-[#2E2E2E]">Información técnica:</strong> dirección IP, tipo de navegador, dispositivo</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-[#2E2E2E] tracking-[-0.01em] mb-4">2. Cómo Usamos tu Información</h2>
            <p className="font-sans text-base text-[#737373] leading-relaxed tracking-[-0.01em] mb-4">
              Utilizamos tu información para:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-sans text-base text-[#737373] leading-relaxed tracking-[-0.01em]">
              <li>Proporcionar y mantener el servicio de envío de SMS</li>
              <li>Gestionar tu cuenta y balance de coins</li>
              <li>Enviar notificaciones importantes sobre tu cuenta</li>
              <li>Mejorar nuestros servicios y experiencia de usuario</li>
              <li>Prevenir fraudes y abusos del sistema</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-[#2E2E2E] tracking-[-0.01em] mb-4">3. Protección de Datos</h2>
            <p className="font-sans text-base text-[#737373] leading-relaxed tracking-[-0.01em] mb-4">
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-sans text-base text-[#737373] leading-relaxed tracking-[-0.01em]">
              <li>Encriptación de datos en tránsito y en reposo</li>
              <li>Autenticación segura mediante Supabase Auth</li>
              <li>Acceso restringido a información personal</li>
              <li>Monitoreo continuo de seguridad</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-[#2E2E2E] tracking-[-0.01em] mb-4">4. Compartición de Información</h2>
            <p className="font-sans text-base text-[#737373] leading-relaxed tracking-[-0.01em] mb-4">
              No vendemos ni compartimos tu información personal con terceros, excepto:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-sans text-base text-[#737373] leading-relaxed tracking-[-0.01em]">
              <li><strong className="text-[#2E2E2E]">Obligaciones legales:</strong> cuando sea requerido por ley o autoridades competentes</li>
              <li><strong className="text-[#2E2E2E]">Protección de derechos:</strong> para defender nuestros derechos legales</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-[#2E2E2E] tracking-[-0.01em] mb-4">5. Tus Derechos</h2>
            <p className="font-sans text-base text-[#737373] leading-relaxed tracking-[-0.01em] mb-4">
              Tienes derecho a:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-sans text-base text-[#737373] leading-relaxed tracking-[-0.01em]">
              <li>Acceder a tu información personal</li>
              <li>Corregir datos inexactos</li>
              <li>Solicitar la eliminación de tu cuenta</li>
              <li>Oponerte al procesamiento de tus datos</li>
              <li>Exportar tus datos</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-[#2E2E2E] tracking-[-0.01em] mb-4">6. Retención de Datos</h2>
            <p className="font-sans text-base text-[#737373] leading-relaxed tracking-[-0.01em]">
              Conservamos tu información personal durante el tiempo necesario para cumplir con los fines descritos 
              en esta política, a menos que se requiera o permita un período de retención más largo por ley.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-[#2E2E2E] tracking-[-0.01em] mb-4">7. Contacto</h2>
            <p className="font-sans text-base text-[#737373] leading-relaxed tracking-[-0.01em]">
              Para cualquier consulta sobre estos términos, contáctanos por Telegram:{" "}
              <a href="https://t.me/pedrobardaji" target="_blank" rel="noopener noreferrer" className="text-[#2E2E2E] underline">
                @pedrobardaji
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[#E5E5E5] text-sm text-[#737373]">
          <p>Última actualización: Febrero 2026</p>
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
