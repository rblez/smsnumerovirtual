import { SFIcon } from '@bradleyhodges/sfsymbols-react'
import { sfGlobe, sfCreditcard, sfShield, sfBubbleLeft } from '@bradleyhodges/sfsymbols'

const features = [
  {
    icon: sfGlobe,
    title: "Cobertura Global",
    description: "Envía SMS a más de 200 países con tarifas competitivas y entrega confiable."
  },
  {
    icon: sfCreditcard,
    title: "Sistema de Créditos",
    description: "Compra créditos prepagados y úsalos cuando necesites. Sin suscripciones ni cargos ocultos."
  },
  {
    icon: sfShield,
    title: "Seguro y Confiable",
    description: "Tus datos y mensajes están protegidos. Plataforma estable con alta disponibilidad."
  },
  {
    icon: sfBubbleLeft,
    title: "Envío Instantáneo",
    description: "Los mensajes se envían en segundos. Seguimiento en tiempo real del estado de entrega."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2E2E2E] mb-4">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-lg text-[#3E3E3E] max-w-2xl mx-auto">
            La plataforma más sencilla para enviar SMS internacionales
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-[var(--color-secondary)]/30 border border-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/50 transition-colors duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-[#2E2E2E] flex items-center justify-center mb-4">
                <SFIcon icon={feature.icon} size={24} color="white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2E2E2E] mb-2">
                {feature.title}
              </h3>
              <p className="text-[#3E3E3E] text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
