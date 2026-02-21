"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

const coinsOptions = [10, 20, 50, 100, 200, 500];

export default function Pricing() {
  const [selectedCoins, setSelectedCoins] = useState(50);
  
  const telegramLink = `https://t.me/pedrobardaji?text=Hola, quiero comprar ${selectedCoins} coins`;

  return (
    <section id="precios" className="py-20 bg-[var(--color-secondary)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2E2E2E] mb-4">
            Comprar Coins
          </h2>
          <p className="text-lg text-[#3E3E3E]">
            1 coin = 1 SMS a Cuba/USA | 2-3 coins = 1 SMS a otros países
          </p>
        </div>

        {/* Selector Coins */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <label className="block text-sm font-medium text-[#3E3E3E] mb-4 text-center">
              Selecciona la cantidad de coins
            </label>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {coinsOptions.map((coins) => (
                <button
                  key={coins}
                  onClick={() => setSelectedCoins(coins)}
                  className={`py-3 px-4 rounded-xl font-semibold transition-colors ${
                    selectedCoins === coins
                      ? "bg-[#2E2E2E] text-white"
                      : "bg-gray-100 text-[#2E2E2E] hover:bg-gray-200"
                  }`}
                >
                  {coins} coins
                </button>
              ))}
            </div>
          </div>

          {/* Resumen */}
          <div className="bg-white rounded-xl p-6 mb-8 border border-[var(--color-secondary)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#3E3E3E]">Cantidad:</span>
              <span className="text-xl font-bold text-[#2E2E2E]">{selectedCoins} coins</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#3E3E3E]">SMS a Cuba/USA:</span>
              <span className="text-3xl font-bold text-[#2E2E2E]">{selectedCoins}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[#3E3E3E]">SMS a otros países:</span>
              <span className="text-lg font-bold text-[#2E2E2E]">~{Math.floor(selectedCoins / 2)} - {Math.floor(selectedCoins / 3)}</span>
            </div>
          </div>

          {/* Botón Comprar */}
          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-2 bg-[#2E2E2E] text-white py-4 rounded-xl font-semibold hover:bg-[#3E3E3E] transition-colors"
          >
            <span>Ir a Comprar por Telegram</span>
            <ArrowRight className="w-5 h-5" />
          </a>

          <p className="text-center text-sm text-[#3E3E3E] mt-4">
            Te redirigiremos a Telegram para completar la compra
          </p>
        </div>

        {/* Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[#3E3E3E]">
            * Los coins no tienen fecha de vencimiento
          </p>
        </div>
      </div>
    </section>
  );
}
