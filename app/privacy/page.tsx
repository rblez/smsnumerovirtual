import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad - SMS Número Virtual",
  description: "Política de privacidad de SMS Número Virtual. Conoce cómo protegemos tus datos personales.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-[#737373] hover:text-[#2E2E2E] mb-8 inline-block">
          ← Volver al inicio
        </Link>
        
        <h1 className="text-3xl font-bold text-[#2E2E2E] mb-8">Política de Privacidad</h1>
        
        <div className="prose prose-sm text-[#737373] space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-[#2E2E2E] mb-3">1. Información que Recopilamos</h2>
            <p>Recopilamos la siguiente información cuando utilizas nuestro servicio:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Información de cuenta:</strong> nombre, email, número de teléfono</li>
              <li><strong>Información de uso:</strong> historial de SMS enviados, balance de coins</li>
              <li><strong>Información técnica:</strong> dirección IP, tipo de navegador, dispositivo</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2E2E2E] mb-3">2. Cómo Usamos tu Información</h2>
            <p>Utilizamos tu información para:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Proporcionar y mantener el servicio de envío de SMS</li>
              <li>Gestionar tu cuenta y balance de coins</li>
              <li>Enviar notificaciones importantes sobre tu cuenta</li>
              <li>Mejorar nuestros servicios y experiencia de usuario</li>
              <li>Prevenir fraudes y abusos del sistema</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2E2E2E] mb-3">3. Protección de Datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Encriptación de datos en tránsito y en reposo</li>
              <li>Autenticación segura mediante Supabase Auth</li>
              <li>Acceso restringido a información personal</li>
              <li>Monitoreo continuo de seguridad</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2E2E2E] mb-3">4. Compartición de Información</h2>
            <p>
              No vendemos ni compartimos tu información personal con terceros, excepto:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Proveedores de servicios:</strong> Innoverit (para envío de SMS), Supabase (para almacenamiento)</li>
              <li><strong>Obligaciones legales:</strong> cuando sea requerido por ley o autoridades competentes</li>
              <li><strong>Protección de derechos:</strong> para defender nuestros derechos legales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2E2E2E] mb-3">5. Tus Derechos</h2>
            <p>Tienes derecho a:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Acceder a tu información personal</li>
              <li>Corregir datos inexactos</li>
              <li>Solicitar la eliminación de tu cuenta</li>
              <li>Oponerte al procesamiento de tus datos</li>
              <li>Exportar tus datos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2E2E2E] mb-3">6. Retención de Datos</h2>
            <p>
              Conservamos tu información mientras mantengas una cuenta activa. 
              Los logs de SMS se mantienen por 2 años para fines de auditoría y cumplimiento legal. 
              Si eliminas tu cuenta, tus datos personales se eliminarán en un plazo de 30 días.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2E2E2E] mb-3">7. Cookies</h2>
            <p>
              Utilizamos cookies esenciales para el funcionamiento del sitio y cookies de 
              análisis para mejorar nuestros servicios. Puedes deshabilitar las cookies no 
              esenciales en la configuración de tu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2E2E2E] mb-3">8. Cambios en esta Política</h2>
            <p>
              Podemos actualizar esta política de privacidad periódicamente. Te notificaremos 
              sobre cambios significativos mediante email o notificación en la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2E2E2E] mb-3">9. Contacto</h2>
            <p>
              Para consultas sobre privacidad, contáctanos por Telegram:{' '}
              <a href="https://t.me/pedrobardaji" target="_blank" rel="noopener noreferrer" className="text-[#2E2E2E] underline">
                @pedrobardaji
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[#E5E5E5] text-sm text-[#737373]">
          <p>Última actualización: Febrero 2026</p>
        </div>
      </div>
    </div>
  );
}
