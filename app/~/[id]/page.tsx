"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { SFIcon } from '@bradleyhodges/sfsymbols-react'
import { Coins } from "lucide-react";
import { 
  sfClockCircle,
  sfGear,
  sfPerson,
  sfDollarsignCircle,
  sfCheckmarkCircle,
  sfExclamationmarkCircle,
  sfBubbleLeft,
  sfChevronDown,
} from '@bradleyhodges/sfsymbols'

interface Profile {
  id: string;
  full_name: string | null;
  credits_balance: number;
  email?: string;
}

interface SMSHistory {
  id: string;
  phone_number: string;
  message: string;
  cost: number;
  status: string;
  created_at: string;
}

interface Country {
  code: string;
  name: string;
  dialCode: string;
}

const countries: Country[] = [
  { code: "cu", name: "Cuba", dialCode: "+53" },
  { code: "us", name: "Estados Unidos", dialCode: "+1" },
  { code: "ca", name: "Canadá", dialCode: "+1" },
  { code: "mx", name: "México", dialCode: "+52" },
  { code: "es", name: "España", dialCode: "+34" },
  { code: "gb", name: "Reino Unido", dialCode: "+44" },
  { code: "de", name: "Alemania", dialCode: "+49" },
  { code: "fr", name: "Francia", dialCode: "+33" },
  { code: "it", name: "Italia", dialCode: "+39" },
  { code: "br", name: "Brasil", dialCode: "+55" },
  { code: "ar", name: "Argentina", dialCode: "+54" },
  { code: "co", name: "Colombia", dialCode: "+57" },
  { code: "pe", name: "Perú", dialCode: "+51" },
  { code: "cl", name: "Chile", dialCode: "+56" },
  { code: "ve", name: "Venezuela", dialCode: "+58" },
  { code: "ec", name: "Ecuador", dialCode: "+593" },
  { code: "do", name: "Rep. Dominicana", dialCode: "+1" },
  { code: "pr", name: "Puerto Rico", dialCode: "+1" },
  { code: "uy", name: "Uruguay", dialCode: "+598" },
  { code: "py", name: "Paraguay", dialCode: "+595" },
  { code: "bo", name: "Bolivia", dialCode: "+591" },
  { code: "pa", name: "Panamá", dialCode: "+507" },
  { code: "cr", name: "Costa Rica", dialCode: "+506" },
  { code: "gt", name: "Guatemala", dialCode: "+502" },
  { code: "hn", name: "Honduras", dialCode: "+504" },
  { code: "sv", name: "El Salvador", dialCode: "+503" },
  { code: "ni", name: "Nicaragua", dialCode: "+505" },
  { code: "jm", name: "Jamaica", dialCode: "+1" },
  { code: "ht", name: "Haití", dialCode: "+509" },
  { code: "bs", name: "Bahamas", dialCode: "+1" },
  { code: "bb", name: "Barbados", dialCode: "+1" },
  { code: "tt", name: "Trinidad y Tobago", dialCode: "+1" },
  { code: "gy", name: "Guyana", dialCode: "+592" },
  { code: "sr", name: "Surinam", dialCode: "+597" },
  { code: "gf", name: "Guayana Francesa", dialCode: "+594" },
  { code: "pt", name: "Portugal", dialCode: "+351" },
  { code: "nl", name: "Países Bajos", dialCode: "+31" },
  { code: "be", name: "Bélgica", dialCode: "+32" },
  { code: "ch", name: "Suiza", dialCode: "+41" },
  { code: "at", name: "Austria", dialCode: "+43" },
  { code: "se", name: "Suecia", dialCode: "+46" },
  { code: "no", name: "Noruega", dialCode: "+47" },
  { code: "dk", name: "Dinamarca", dialCode: "+45" },
  { code: "fi", name: "Finlandia", dialCode: "+358" },
  { code: "ie", name: "Irlanda", dialCode: "+353" },
  { code: "pl", name: "Polonia", dialCode: "+48" },
  { code: "cz", name: "República Checa", dialCode: "+420" },
  { code: "hu", name: "Hungría", dialCode: "+36" },
  { code: "ro", name: "Rumania", dialCode: "+40" },
  { code: "bg", name: "Bulgaria", dialCode: "+359" },
  { code: "hr", name: "Croacia", dialCode: "+385" },
  { code: "si", name: "Eslovenia", dialCode: "+386" },
  { code: "sk", name: "Eslovaquia", dialCode: "+421" },
  { code: "lt", name: "Lituania", dialCode: "+370" },
  { code: "lv", name: "Letonia", dialCode: "+371" },
  { code: "ee", name: "Estonia", dialCode: "+372" },
  { code: "ua", name: "Ucrania", dialCode: "+380" },
  { code: "by", name: "Bielorrusia", dialCode: "+375" },
  { code: "md", name: "Moldavia", dialCode: "+373" },
  { code: "ru", name: "Rusia", dialCode: "+7" },
  { code: "kz", name: "Kazajistán", dialCode: "+7" },
  { code: "uz", name: "Uzbekistán", dialCode: "+998" },
  { code: "kg", name: "Kirguistán", dialCode: "+996" },
  { code: "tj", name: "Tayikistán", dialCode: "+992" },
  { code: "tm", name: "Turkmenistán", dialCode: "+993" },
  { code: "az", name: "Azerbaiyán", dialCode: "+994" },
  { code: "ge", name: "Georgia", dialCode: "+995" },
  { code: "am", name: "Armenia", dialCode: "+374" },
  { code: "tr", name: "Turquía", dialCode: "+90" },
  { code: "cy", name: "Chipre", dialCode: "+357" },
  { code: "gr", name: "Grecia", dialCode: "+30" },
  { code: "mt", name: "Malta", dialCode: "+356" },
  { code: "is", name: "Islandia", dialCode: "+354" },
  { code: "al", name: "Albania", dialCode: "+355" },
  { code: "ba", name: "Bosnia y Herzegovina", dialCode: "+387" },
  { code: "me", name: "Montenegro", dialCode: "+382" },
  { code: "mk", name: "Macedonia del Norte", dialCode: "+389" },
  { code: "rs", name: "Serbia", dialCode: "+381" },
  { code: "xk", name: "Kosovo", dialCode: "+383" },
  { code: "il", name: "Israel", dialCode: "+972" },
  { code: "ps", name: "Palestina", dialCode: "+970" },
  { code: "jo", name: "Jordania", dialCode: "+962" },
  { code: "lb", name: "Líbano", dialCode: "+961" },
  { code: "sy", name: "Siria", dialCode: "+963" },
  { code: "iq", name: "Irak", dialCode: "+964" },
  { code: "sa", name: "Arabia Saudita", dialCode: "+966" },
  { code: "ye", name: "Yemen", dialCode: "+967" },
  { code: "om", name: "Omán", dialCode: "+968" },
  { code: "ae", name: "Emiratos Árabes", dialCode: "+971" },
  { code: "qa", name: "Catar", dialCode: "+974" },
  { code: "bh", name: "Baréin", dialCode: "+973" },
  { code: "kw", name: "Kuwait", dialCode: "+965" },
  { code: "eg", name: "Egipto", dialCode: "+20" },
  { code: "ly", name: "Libia", dialCode: "+218" },
  { code: "tn", name: "Túnez", dialCode: "+216" },
  { code: "dz", name: "Argelia", dialCode: "+213" },
  { code: "ma", name: "Marruecos", dialCode: "+212" },
  { code: "mr", name: "Mauritania", dialCode: "+222" },
  { code: "sn", name: "Senegal", dialCode: "+221" },
  { code: "gm", name: "Gambia", dialCode: "+220" },
  { code: "gw", name: "Guinea-Bisáu", dialCode: "+245" },
  { code: "gn", name: "Guinea", dialCode: "+224" },
  { code: "sl", name: "Sierra Leona", dialCode: "+232" },
  { code: "lr", name: "Liberia", dialCode: "+231" },
  { code: "ci", name: "Costa de Marfil", dialCode: "+225" },
  { code: "gh", name: "Ghana", dialCode: "+233" },
  { code: "tg", name: "Togo", dialCode: "+228" },
  { code: "bj", name: "Benín", dialCode: "+229" },
  { code: "bf", name: "Burkina Faso", dialCode: "+226" },
  { code: "ne", name: "Níger", dialCode: "+227" },
  { code: "ng", name: "Nigeria", dialCode: "+234" },
  { code: "cm", name: "Camerún", dialCode: "+237" },
  { code: "td", name: "Chad", dialCode: "+235" },
  { code: "cf", name: "Rep. Centroafricana", dialCode: "+236" },
  { code: "gq", name: "Guinea Ecuatorial", dialCode: "+240" },
  { code: "ga", name: "Gabón", dialCode: "+241" },
  { code: "cg", name: "Congo", dialCode: "+242" },
  { code: "cd", name: "Congo (RDC)", dialCode: "+243" },
  { code: "ao", name: "Angola", dialCode: "+244" },
  { code: "st", name: "Santo Tomé", dialCode: "+239" },
  { code: "cv", name: "Cabo Verde", dialCode: "+238" },
  { code: "et", name: "Etiopía", dialCode: "+251" },
  { code: "er", name: "Eritrea", dialCode: "+291" },
  { code: "dj", name: "Yibuti", dialCode: "+253" },
  { code: "so", name: "Somalia", dialCode: "+252" },
  { code: "ke", name: "Kenia", dialCode: "+254" },
  { code: "ug", name: "Uganda", dialCode: "+256" },
  { code: "rw", name: "Ruanda", dialCode: "+250" },
  { code: "bi", name: "Burundi", dialCode: "+257" },
  { code: "tz", name: "Tanzania", dialCode: "+255" },
  { code: "mw", name: "Malaui", dialCode: "+265" },
  { code: "zm", name: "Zambia", dialCode: "+260" },
  { code: "zw", name: "Zimbabue", dialCode: "+263" },
  { code: "mz", name: "Mozambique", dialCode: "+258" },
  { code: "mg", name: "Madagascar", dialCode: "+261" },
  { code: "mu", name: "Mauricio", dialCode: "+230" },
  { code: "sc", name: "Seychelles", dialCode: "+248" },
  { code: "km", name: "Comoras", dialCode: "+269" },
  { code: "ls", name: "Lesoto", dialCode: "+266" },
  { code: "sz", name: "Esuatini", dialCode: "+268" },
  { code: "za", name: "Sudáfrica", dialCode: "+27" },
  { code: "na", name: "Namibia", dialCode: "+264" },
  { code: "bw", name: "Botsuana", dialCode: "+267" },
  { code: "sd", name: "Sudán", dialCode: "+249" },
  { code: "ss", name: "Sudán del Sur", dialCode: "+211" },
  { code: "ml", name: "Malí", dialCode: "+223" },
  { code: "ir", name: "Irán", dialCode: "+98" },
  { code: "af", name: "Afganistán", dialCode: "+93" },
  { code: "pk", name: "Pakistán", dialCode: "+92" },
  { code: "in", name: "India", dialCode: "+91" },
  { code: "np", name: "Nepal", dialCode: "+977" },
  { code: "bt", name: "Bután", dialCode: "+975" },
  { code: "bd", name: "Bangladés", dialCode: "+880" },
  { code: "lk", name: "Sri Lanka", dialCode: "+94" },
  { code: "mv", name: "Maldivas", dialCode: "+960" },
  { code: "mm", name: "Myanmar", dialCode: "+95" },
  { code: "th", name: "Tailandia", dialCode: "+66" },
  { code: "la", name: "Laos", dialCode: "+856" },
  { code: "vn", name: "Vietnam", dialCode: "+84" },
  { code: "kh", name: "Camboya", dialCode: "+855" },
  { code: "my", name: "Malasia", dialCode: "+60" },
  { code: "sg", name: "Singapur", dialCode: "+65" },
  { code: "id", name: "Indonesia", dialCode: "+62" },
  { code: "ph", name: "Filipinas", dialCode: "+63" },
  { code: "cn", name: "China", dialCode: "+86" },
  { code: "jp", name: "Japón", dialCode: "+81" },
  { code: "kr", name: "Corea del Sur", dialCode: "+82" },
  { code: "kp", name: "Corea del Norte", dialCode: "+850" },
  { code: "mn", name: "Mongolia", dialCode: "+976" },
  { code: "tw", name: "Taiwán", dialCode: "+886" },
  { code: "hk", name: "Hong Kong", dialCode: "+852" },
  { code: "mo", name: "Macao", dialCode: "+853" },
  { code: "au", name: "Australia", dialCode: "+61" },
  { code: "nz", name: "Nueva Zelanda", dialCode: "+64" },
  { code: "pg", name: "Papúa Nueva Guinea", dialCode: "+675" },
  { code: "fj", name: "Fiyi", dialCode: "+679" },
  { code: "sb", name: "Islas Salomón", dialCode: "+677" },
  { code: "vu", name: "Vanuatu", dialCode: "+678" },
  { code: "nc", name: "Nueva Caledonia", dialCode: "+687" },
  { code: "pf", name: "Polinesia Francesa", dialCode: "+689" },
  { code: "wf", name: "Wallis y Futuna", dialCode: "+681" },
  { code: "ck", name: "Islas Cook", dialCode: "+682" },
  { code: "nu", name: "Niue", dialCode: "+683" },
  { code: "to", name: "Tonga", dialCode: "+676" },
  { code: "ws", name: "Samoa", dialCode: "+685" },
  { code: "ki", name: "Kiribati", dialCode: "+686" },
  { code: "tv", name: "Tuvalu", dialCode: "+688" },
  { code: "nr", name: "Nauru", dialCode: "+674" },
  { code: "mh", name: "Islas Marshall", dialCode: "+692" },
  { code: "pw", name: "Palaos", dialCode: "+680" },
  { code: "fm", name: "Micronesia", dialCode: "+691" },
  { code: "gu", name: "Guam", dialCode: "+1" },
  { code: "mp", name: "Islas Marianas", dialCode: "+1" },
  { code: "as", name: "Samoa Americana", dialCode: "+1" },
  { code: "vg", name: "Islas Vírgenes (UK)", dialCode: "+1" },
  { code: "vi", name: "Islas Vírgenes (US)", dialCode: "+1" },
  { code: "ky", name: "Islas Caimán", dialCode: "+1" },
  { code: "tc", name: "Islas Turcas", dialCode: "+1" },
  { code: "ag", name: "Antigua y Barbuda", dialCode: "+1" },
  { code: "kn", name: "San Cristóbal", dialCode: "+1" },
  { code: "lc", name: "Santa Lucía", dialCode: "+1" },
  { code: "dm", name: "Dominica", dialCode: "+1" },
  { code: "vc", name: "San Vicente", dialCode: "+1" },
  { code: "gd", name: "Granada", dialCode: "+1" },
  { code: "ms", name: "Montserrat", dialCode: "+1" },
  { code: "ai", name: "Anguila", dialCode: "+1" },
  { code: "bm", name: "Bermudas", dialCode: "+1" },
  { code: "gl", name: "Groenlandia", dialCode: "+299" },
  { code: "fo", name: "Islas Feroe", dialCode: "+298" },
  { code: "gi", name: "Gibraltar", dialCode: "+350" },
  { code: "je", name: "Jersey", dialCode: "+44" },
  { code: "gg", name: "Guernsey", dialCode: "+44" },
  { code: "im", name: "Isla de Man", dialCode: "+44" },
  { code: "li", name: "Liechtenstein", dialCode: "+423" },
  { code: "mc", name: "Mónaco", dialCode: "+377" },
  { code: "sm", name: "San Marino", dialCode: "+378" },
  { code: "va", name: "Vaticano", dialCode: "+379" },
  { code: "ad", name: "Andorra", dialCode: "+376" },
  { code: "lu", name: "Luxemburgo", dialCode: "+352" },
  { code: "mq", name: "Martinica", dialCode: "+596" },
  { code: "gp", name: "Guadalupe", dialCode: "+590" },
  { code: "bl", name: "San Bartolomé", dialCode: "+590" },
  { code: "mf", name: "San Martín", dialCode: "+590" },
  { code: "pm", name: "San Pedro", dialCode: "+508" },
  { code: "yt", name: "Mayotte", dialCode: "+262" },
  { code: "bq", name: "Bonaire", dialCode: "+599" },
  { code: "cw", name: "Curazao", dialCode: "+599" },
  { code: "sx", name: "Sint Maarten", dialCode: "+1" },
];

export default function DashboardPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [actualUserId, setActualUserId] = useState<string | null>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState<"home" | "history" | "settings">("home");
  const [loading, setLoading] = useState(true);

  // SMS State
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [smsResult, setSmsResult] = useState<{ success: boolean; message: string } | null>(null);

  // History State
  const [history, setHistory] = useState<SMSHistory[]>([]);

  const maxChars = 160;
  const messageLength = message.length;
  const smsCount = Math.ceil(messageLength / maxChars) || 1;

  const fetchProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // First, try to find profile by custom_id
      const { data: profileByCustomId } = await supabase
        .from("profiles")
        .select("id, full_name, credits_balance, custom_id")
        .eq("custom_id", userId)
        .single();

      if (profileByCustomId) {
        // Found by custom_id - verify the logged-in user owns this profile
        if (profileByCustomId.id !== user.id) {
          router.push("/login");
          return;
        }
        setActualUserId(profileByCustomId.id);
        setProfile({ 
          id: profileByCustomId.id,
          full_name: profileByCustomId.full_name, 
          credits_balance: profileByCustomId.credits_balance,
          email: user.email 
        });
        fetchHistory(profileByCustomId.id);
      } else {
        // Fallback: try to find by UUID (for backward compatibility)
        const { data: profileByUuid } = await supabase
          .from("profiles")
          .select("id, full_name, credits_balance, custom_id")
          .eq("id", userId)
          .single();

        if (profileByUuid && profileByUuid.id === user.id) {
          setActualUserId(profileByUuid.id);
          setProfile({ 
            id: profileByUuid.id,
            full_name: profileByUuid.full_name, 
            credits_balance: profileByUuid.credits_balance,
            email: user.email 
          });
          fetchHistory(profileByUuid.id);
        } else {
          router.push("/login");
          return;
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const fetchHistory = async (uid: string) => {
    try {
      const { data } = await supabase
        .from("sms_history")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false })
        .limit(50);

      if (data) setHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const handleSendSMS = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSmsResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No hay sesión activa");

      const fullPhoneNumber = `${selectedCountry.dialCode}${phoneNumber}`;

      const response = await fetch("/api/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          phoneNumber: fullPhoneNumber,
          message,
          userId: actualUserId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar SMS");
      }

      setSmsResult({
        success: true,
        message: `SMS enviado a ${data.destination}`,
      });

      setPhoneNumber("");
      setMessage("");
      fetchProfile();
      if (actualUserId) fetchHistory(actualUserId);
    } catch (error: unknown) {
      setSmsResult({
        success: false,
        message: error instanceof Error ? error.message : "Error al enviar SMS",
      });
    } finally {
      setSending(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const getCoinsCost = (dialCode: string): number => {
    if (dialCode === "+53" || dialCode === "+1") return 1;
    if (["+52", "+34", "+44", "+49", "+33", "+39", "+55", "+54", "+57"].includes(dialCode)) return 2;
    return 3;
  };

  const getPhonePlaceholder = (countryCode: string): string => {
    const formats: { [key: string]: string } = {
      // 8 dígitos
      "cu": "0000 0000",
      "uy": "0000 0000",
      "bo": "0000 0000",
      "pa": "0000 0000",
      "cr": "0000 0000",
      "gt": "0000 0000",
      "hn": "0000 0000",
      "sv": "0000 0000",
      "ni": "0000 0000",
      "ht": "0000 0000",
      // 9 dígitos
      "es": "000 000 000",
      "fr": "0 00 00 00 00",
      "pe": "000 000 000",
      "ec": "000 000 000",
      "py": "000 000 000",
      "cl": "0000 0000",
      "pt": "000 000 000",
      "nl": "0 000 000 00",
      "be": "000 00 00 00",
      "ch": "000 000 000",
      "at": "0000 000 000",
      "se": "000-000 000",
      "no": "000 00 000",
      "dk": "00 00 00 00",
      "fi": "00 000 000",
      "ie": "000 000 000",
      "pl": "000 000 000",
      "cz": "000 000 000",
      "hu": "00 000 000",
      "ro": "000 000 000",
      "bg": "000 000 000",
      "hr": "00 000 000",
      "si": "00 000 000",
      "sk": "000 000 000",
      "lt": "000 00000",
      "lv": "00 000 000",
      "ee": "000 0000",
      "ve": "0000 0000",
      "gf": "000 00 00 00",
      // 10 dígitos
      "us": "000-000-0000",
      "ca": "000-000-0000",
      "mx": "000 000 0000",
      "co": "000 000 0000",
      "do": "000-000-0000",
      "pr": "000-000-0000",
      "jm": "000-000-0000",
      "bs": "000-000-0000",
      "bb": "000-000-0000",
      "tt": "000-0000",
      "br": "00000-0000",
      // 11 dígitos
      "gb": "0000 000 000",
      "de": "0000 000 000",
      "it": "000 0000 000",
      // 7 dígitos
      "gy": "000 0000",
      "sr": "000 000"
    };
    return formats[countryCode] || "000 000 000";
  };

  const estimatedCost = getCoinsCost(selectedCountry.dialCode) * smsCount;

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#FAFAFA] to-[#E8E1D4]/30 px-4 py-10 lg:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center items-center">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Image src="/isotipo.png" alt="SMS Número Virtual" width={64} height={64} className="h-16 w-auto" />
          </motion.div>
          <p className="mt-4 text-lg font-medium text-[#2E2E2E]">Cargando...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: "home", label: "Enviar SMS", icon: sfBubbleLeft },
    { id: "history", label: "Historial", icon: sfClockCircle },
    { id: "settings", label: "Configuración", icon: sfGear },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-[#FAFAFA] to-[#E8E1D4]/30 px-4 py-10 lg:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center">
        <Link href="/" className="flex items-center justify-center gap-3 mb-6">
          <Image
            src="/isotipo.png"
            alt="SMS Número Virtual"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
          <span className="text-xl font-bold text-[#2E2E2E]">
            SMS Número Virtual
          </span>
        </Link>

        {/* User Info Bar */}
        <div className="mb-6 p-4 bg-white rounded-xl border border-[#E5E5E5]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2E2E2E] flex items-center justify-center">
                <SFIcon icon={sfPerson} size={20} color="white" />
              </div>
              <div>
                <p className="font-medium text-[#2E2E2E] text-sm">{profile?.full_name || "Usuario"}</p>
                <p className="text-xs text-[#737373]">{profile?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <SFIcon icon={sfDollarsignCircle} size={16} color="#2E2E2E" />
              <span className="font-bold text-[#2E2E2E] text-sm">{profile?.credits_balance || 0}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 flex bg-white rounded-xl border border-[#E5E5E5] p-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as "home" | "history" | "settings")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-[#2E2E2E] text-white"
                  : "text-[#737373] hover:text-[#2E2E2E]"
              }`}
            >
              <SFIcon icon={item.icon} size={16} color={activeTab === item.id ? "white" : "currentColor"} />
              {item.label}
            </button>
          ))}
        </div>

        {/* HOME - Send SMS */}
        {activeTab === "home" && (
            <div>
              {smsResult && (
                <div
                  className={`mb-6 p-4 flex items-center gap-3 rounded-xl ${
                    smsResult.success
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  <SFIcon icon={smsResult.success ? sfCheckmarkCircle : sfExclamationmarkCircle} size={20} color="currentColor" />
                  <span className="font-medium text-sm">{smsResult.message}</span>
                </div>
              )}

              <form onSubmit={handleSendSMS} className="space-y-6">
                {/* Country & Phone - Integrated */}
                <div>
                  <label className="block text-sm font-medium text-[#2E2E2E] mb-2">
                    Número de teléfono
                  </label>
                  <div className="flex h-12 border border-[#E5E5E5] bg-white rounded-xl">
                    {/* Country Selector */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        className="flex items-center gap-2 h-full px-4 bg-[#E8E1D4] border-r border-[#E5E5E5] hover:bg-[#d4ccc0] transition-colors rounded-l-xl"
                      >
                        <span className={`fi fi-${selectedCountry.code} w-7 h-5`}></span>
                        <SFIcon icon={sfChevronDown} size={16} color="#2E2E2E" />
                      </button>

                      {showCountryDropdown && (
                        <div className="absolute top-full left-0 mt-1 w-80 max-h-96 overflow-y-auto bg-white border border-[#E5E5E5] shadow-xl z-[100] rounded-xl">
                          {countries.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => {
                                setSelectedCountry(country);
                                setShowCountryDropdown(false);
                                setPhoneNumber("");
                              }}
                              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-[#E8E1D4] transition-colors text-left"
                            >
                              <span className={`fi fi-${country.code} w-6 h-4 shrink-0`}></span>
                              <span className="text-sm font-medium text-[#2E2E2E] truncate">{country.name}</span>
                              <span className="text-sm text-[#737373] ml-auto shrink-0">{country.dialCode}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Phone Input with fixed country code */}
                    <div className="relative flex-1 flex items-center border-l border-[#E5E5E5]">
                      <span className="text-base font-medium text-[#737373] pl-4 pr-2 select-none whitespace-nowrap">
                        {selectedCountry.dialCode}
                      </span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, "");
                          setPhoneNumber(value);
                        }}
                        className="flex-1 h-full bg-transparent border-0 focus:outline-none focus:bg-[#FAFAFA]/50 transition-all text-base rounded-r-xl placeholder:text-[#A0A0A0]"
                        placeholder={getPhonePlaceholder(selectedCountry.code)}
                        required
                      />
                    </div>
                  </div>
                  <p className="text-sm text-[#737373] mt-2">País: {selectedCountry.name}</p>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-[#2E2E2E] mb-2">
                    Mensaje
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-5 py-4 bg-white border border-[#E5E5E5] focus:outline-none focus:bg-[#FAFAFA] transition-all resize-none text-base rounded-xl"
                    placeholder="Escribe tu mensaje aquí..."
                    rows={4}
                    maxLength={maxChars * 3}
                    required
                  />
                  <div className="flex justify-between text-sm text-[#737373] mt-2">
                    <span>{messageLength}/{maxChars * 3} caracteres</span>
                    <span className="flex items-center gap-1">
                      {smsCount} SMS • {estimatedCost}
                      <SFIcon icon={sfDollarsignCircle} size={14} color="#737373" />
                    </span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={sending || !phoneNumber || !message}
                  className="w-full bg-[#2E2E2E] text-white py-3.5 text-base font-semibold hover:bg-[#3E3E3E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
                >
                  {sending ? "Enviando..." : "Enviar"}
                </button>
              </form>
            </div>
          )}

        {/* HISTORY */}
        {activeTab === "history" && (
          <div>
            <div className="mb-8">
              <h1 className="font-display text-2xl md:text-3xl font-normal text-[#2E2E2E] tracking-[-0.02em] mb-2">Historial de SMS</h1>
              <p className="font-sans text-base text-[#737373] tracking-[-0.01em]">Revisa todos tus mensajes enviados</p>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E5E5]">
                <SFIcon icon={sfClockCircle} size={48} color="#9CA3AF" className="mx-auto mb-4" />
                <p className="font-sans text-[#737373] font-medium tracking-[-0.01em]">No has enviado SMS aún</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((sms) => (
                  <div key={sms.id} className="bg-white border border-[#E5E5E5] rounded-xl p-4 hover:bg-[#FAFAFA] transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-[#2E2E2E] text-sm">{sms.phone_number}</p>
                        <p className="text-sm text-[#737373] mt-1 line-clamp-2">{sms.message}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(sms.created_at).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
                          <Coins className="w-3 h-3" />
                          {sms.cost}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div>
            <div className="mb-6">
              <h1 className="text-xl font-bold text-[#2E2E2E]">Configuración</h1>
              <p className="text-sm text-[#737373]">Gestiona tu cuenta y preferencias</p>
            </div>

            <div className="space-y-6">
              {/* Profile Info */}
              <div className="bg-white border border-[#E5E5E5] rounded-xl p-6">
                <h3 className="font-semibold text-[#2E2E2E] mb-4">Información de perfil</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-[#737373]">Nombre</label>
                    <p className="font-medium text-[#2E2E2E]">{profile?.full_name || "No configurado"}</p>
                  </div>
                  <div>
                    <label className="text-sm text-[#737373]">Email</label>
                    <p className="font-medium text-[#2E2E2E]">{profile?.email}</p>
                  </div>
                </div>
              </div>

              {/* Balance */}
              <div className="bg-white border border-[#E5E5E5] rounded-xl p-6">
                <h3 className="font-semibold text-[#2E2E2E] mb-4">Balance</h3>
                <div className="flex items-center justify-between p-4 bg-[#E8E1D4]/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <SFIcon icon={sfDollarsignCircle} size={20} color="#2E2E2E" />
                    <span className="font-medium">Coins disponibles</span>
                  </div>
                  <span className="text-2xl font-bold text-[#2E2E2E]">{profile?.credits_balance || 0}</span>
                </div>
                <a
                  href="https://t.me/pedrobardaji?text=Hola, quiero comprar más coins"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-3 text-sm text-[#2E2E2E] font-medium hover:underline"
                >
                  Comprar más coins
                  <SFIcon icon={sfChevronDown} size={16} color="#2E2E2E" className="ml-1 rotate-[-90deg]" />
                </a>
              </div>

              {/* Account Actions */}
              <div className="bg-white border border-[#E5E5E5] rounded-xl p-6">
                <h3 className="font-semibold text-[#2E2E2E] mb-4">Cuenta</h3>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                >
                  <span className="font-medium">Cerrar sesión</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
