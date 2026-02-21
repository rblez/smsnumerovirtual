"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  Coins,
  Search,
  Globe,
} from "lucide-react";

// Country name to ISO 3166-1 alpha-2 code mapping (partial)
const countryCodeMap: Record<string, string> = {
  'Afghanistan': 'af',
  'Albania': 'al',
  'Algeria': 'dz',
  'Argentina': 'ar',
  'Australia': 'au',
  'Austria': 'at',
  'Belgium': 'be',
  'Brazil': 'br',
  'Canada': 'ca',
  'Chile': 'cl',
  'China': 'cn',
  'Colombia': 'co',
  'Costa Rica': 'cr',
  'Cuba': 'cu',
  'Denmark': 'dk',
  'Ecuador': 'ec',
  'Egypt': 'eg',
  'Finland': 'fi',
  'France': 'fr',
  'Germany': 'de',
  'Greece': 'gr',
  'Hungary': 'hu',
  'Iceland': 'is',
  'India': 'in',
  'Italy': 'it',
  'Japan': 'jp',
  'Mexico': 'mx',
  'Netherlands': 'nl',
  'Norway': 'no',
  'Peru': 'pe',
  'Poland': 'pl',
  'Portugal': 'pt',
  'Russia': 'ru',
  'Spain': 'es',
  'Sweden': 'se',
  'Switzerland': 'ch',
  'Turkey': 'tr',
  'United Kingdom': 'gb',
  'United States': 'us',
  'Venezuela': 've',
};

interface SMSRate {
  id: string;
  country: string;
  operator: string;
  coins_cost: number;
}

interface Profile {
  credits_balance: number;
}

export default function Rates() {
  const [rates, setRates] = useState<SMSRate[]>([]);
  const [filteredRates, setFilteredRates] = useState<SMSRate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        // Fetch profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("credits_balance")
          .eq("id", user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }

        // Fetch rates - group by country with min coins cost
        const { data: ratesData } = await supabase
          .from("sms_rates")
          .select("id, country, operator, coins_cost")
          .order("country", { ascending: true });

        if (ratesData && Array.isArray(ratesData)) {
          // Group by country and get the minimum price
          const countryMap = new Map<string, SMSRate>();
          ratesData.forEach((rate: SMSRate) => {
            const existing = countryMap.get(rate.country);
            if (!existing || rate.coins_cost < existing.coins_cost) {
              countryMap.set(rate.country, rate);
            }
          });
          const uniqueRates = Array.from(countryMap.values());
          setRates(uniqueRates);
          setFilteredRates(uniqueRates);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Filter rates based on search
  useEffect(() => {
    if (searchTerm) {
      const filtered = rates.filter((rate) =>
        rate.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRates(filtered);
    } else {
      setFilteredRates(rates);
    }
  }, [searchTerm, rates]);

  const getCountryFlag = (country: string) => {
    const code = countryCodeMap[country]?.toLowerCase();
    return code ? `fi fi-${code}` : '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E8E1D4]">
        {/* Header Skeleton */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="h-6 bg-[#E8E1D4] rounded w-48" />
              <div className="flex items-center space-x-2 bg-[#E8E1D4] px-3 py-1.5 rounded-lg">
                <div className="w-4 h-4 bg-[#2E2E2E] rounded" />
                <div className="h-4 bg-[#2E2E2E] rounded w-16" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Skeleton */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button Skeleton */}
          <div className="h-4 bg-[#E8E1D4] rounded w-32 mb-6" />

          {/* Title Skeleton */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-[#E8E1D4] rounded" />
            <div className="h-8 bg-[#E8E1D4] rounded w-48" />
          </div>

          {/* Description Skeleton */}
          <div className="h-4 bg-[#E8E1D4] rounded w-80 mb-6" />

          {/* Search Skeleton */}
          <div className="h-12 bg-white border border-gray-200 rounded-xl mb-6" />

          {/* Table Skeleton */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#E8E1D4]">
                <tr>
                  <th className="px-6 py-4">
                    <div className="h-4 bg-[#2E2E2E] rounded w-12" />
                  </th>
                  <th className="px-6 py-4">
                    <div className="h-4 bg-[#2E2E2E] rounded w-24" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-4 bg-[#E8E1D4] rounded" />
                        <div className="h-4 bg-[#E8E1D4] rounded w-32" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="h-4 bg-[#E8E1D4] rounded w-16 mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Note Skeleton */}
          <div className="mt-6 bg-[#E8E1D4]/20 border border-[#E8E1D4]/40 rounded-xl p-4">
            <div className="space-y-2">
              <div className="h-4 bg-[#E8E1D4] rounded w-full" />
              <div className="h-4 bg-[#E8E1D4] rounded w-3/4" />
              <div className="h-4 bg-[#E8E1D4] rounded w-2/3" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8E1D4]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-[#2E2E2E]">SMS Número Virtual</span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-[#E8E1D4] px-3 py-1.5 rounded-lg">
                <Coins className="w-4 h-4 text-[#2E2E2E]" />
                <span className="font-semibold text-[#2E2E2E]">
                  {(profile?.credits_balance || 0)} coins
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-[#3E3E3E] hover:text-[#2E2E2E] mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver al dashboard
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-8 h-8 text-[#2E2E2E]" />
          <h1 className="text-3xl font-bold text-[#2E2E2E]">Tarifas por país</h1>
        </div>

        <p className="text-[#3E3E3E] mb-6">
          Envía SMS a más de 200 países con precios competitivos.
        </p>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent"
            placeholder="Buscar país..."
          />
        </div>

        {/* Rates Grid */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {filteredRates.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No se encontraron países con ese nombre
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#E8E1D4]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#2E2E2E]">País</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-[#2E2E2E]">Coins por SMS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRates.map((rate) => (
                    <tr key={rate.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-[#2E2E2E]">
                        <div className="flex items-center gap-3">
                          {getCountryFlag(rate.country) && (
                            <span className={`${getCountryFlag(rate.country)} w-6 h-4 rounded-sm shadow-sm`}></span>
                          )}
                          <span>{rate.country}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-bold text-[#2E2E2E]">
                        {rate.coins_cost} coins
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Note */}
        <div className="mt-6 bg-[#E8E1D4]/20 border border-[#E8E1D4]/40 rounded-xl p-4">
          <p className="text-sm text-[#737373]">
            <strong className="text-[#2E2E2E]">Tarifas por coins:</strong> Cada país tiene un costo en coins por SMS enviado.
            <br />• Cuba y países seleccionados: 1 coin por SMS
            <br />• Otros países: 2-3 coins por SMS según destino.
          </p>
        </div>
      </main>
    </div>
  );
}
