import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg text-center">
        <div className="text-7xl md:text-8xl font-semibold tracking-tight text-[#2E2E2E]">
          404
        </div>
        <h1 className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight text-[#2E2E2E]">
          Página no encontrada
        </h1>
        <p className="mt-3 text-sm md:text-base text-[#737373] leading-relaxed">
          La página que buscas no existe o fue movida.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2E2E2E] text-white font-medium hover:bg-[#3E3E3E] transition-colors"
          >
            Volver al inicio
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-xl border border-[#E5E5E5] bg-white text-[#2E2E2E] font-medium hover:border-[#2E2E2E]/30 transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
