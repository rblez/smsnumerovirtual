"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Send,
  CheckCircle,
  X,
  Clock,
} from "lucide-react";
import Layout from "../components/Layout";
import Card from "../components/ui/Card";

interface SMSHistory {
  id: string;
  phone_number: string;
  message: string;
  country: string | null;
  cost: number;
  status: string;
  created_at: string;
}

interface Profile {
  credits_balance: number;
}

export default function History() {
  const [history, setHistory] = useState<SMSHistory[]>([]);
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

        // Fetch SMS history
        const { data: historyData } = await supabase
          .from("sms_history")
          .select("id, phone_number, message, country, cost, status, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (historyData) {
          setHistory(historyData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "failed":
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "sent":
        return "Enviado";
      case "delivered":
        return "Entregado";
      case "failed":
        return "Fallido";
      case "pending":
        return "Pendiente";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E8E1D4] flex items-center justify-center">
        <div className="text-[#2E2E2E] text-lg font-medium">Cargando...</div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-sans text-3xl md:text-4xl font-semibold text-[#2E2E2E] tracking-tight mb-2">
            Historial de SMS
          </h1>
          <p className="font-sans text-sm text-[#737373]">
            Revisa todos tus mensajes enviados
          </p>
        </div>

        {history.length === 0 ? (
          <Card className="p-12 text-center">
            <Send className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#2E2E2E] mb-2">No has enviado SMS aún</h3>
            <p className="text-sm text-[#737373] mb-4">Comienza enviando tu primer mensaje</p>
            <a
              href="/dashboard"
              className="inline-flex items-center bg-[#2E2E2E] text-white px-6 py-3 rounded-xl hover:bg-[#3E3E3E] transition-colors text-sm font-semibold"
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar SMS
            </a>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#E8E1D4]/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#2E2E2E] uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#2E2E2E] uppercase tracking-wider">Número</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#2E2E2E] uppercase tracking-wider">Mensaje</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#2E2E2E] uppercase tracking-wider">País</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#2E2E2E] uppercase tracking-wider">Costo</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#2E2E2E] uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  {history.map((sms) => (
                    <tr key={sms.id} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-6 py-4 text-xs text-[#737373] font-mono">
                        {new Date(sms.created_at).toLocaleDateString("es-ES")}
                        <div className="text-[10px] text-[#737373]/70 mt-0.5">
                          {new Date(sms.created_at).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-[#2E2E2E]">
                        {sms.phone_number}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#737373] max-w-xs truncate">
                        {sms.message}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#737373]">
                        {sms.country || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#2E2E2E]">
                        {sms.cost.toFixed(0)} SMS
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(sms.status)}
                          <span className="text-sm text-[#737373]">{getStatusText(sms.status)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}
