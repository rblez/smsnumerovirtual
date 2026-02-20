import { 
  UserPlus, 
  DollarSign, 
  Send,
  MessageSquareText
} from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Crea tu cuenta",
    description: "Regístrate gratis en menos de un minuto. Solo necesitas un email válido."
  },
  {
    icon: MessageSquareText,
    step: "02",
    title: "Compra créditos",
    description: "Escríbenos por Telegram para adquirir créditos. Te atenderemos rápidamente."
  },
  {
    icon: DollarSign,
    step: "03",
    title: "Recibe tus créditos",
    description: "Una vez confirmado el pago, acreditamos los créditos en tu cuenta automáticamente."
  },
  {
    icon: Send,
    step: "04",
    title: "Envía SMS",
    description: "Ingresa el número destino, escribe tu mensaje y envíalo al instante."
  }
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 bg-[#E8E1D4]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2E2E2E] mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-lg text-[#3E3E3E] max-w-2xl mx-auto">
            En 4 simples pasos podrás enviar SMS a cualquier parte del mundo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div key={index} className="relative">
              {/* Connector line (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-[#E8E1D4]" />
              )}
              
              <div className="text-center">
                {/* Step number and icon */}
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-white border-2 border-[#E8E1D4] flex items-center justify-center shadow-sm">
                    <item.icon className="w-10 h-10 text-[#2E2E2E]" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#2E2E2E] text-white flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-[#2E2E2E] mb-2">
                  {item.title}
                </h3>
                <p className="text-[#3E3E3E] text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
