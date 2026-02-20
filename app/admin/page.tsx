"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { 
  Search,
  Plus,
  LogOut,
  Mail,
} from "lucide-react";

interface UserData {
  id: string;
  email?: string;
  full_name?: string;
  credits_balance?: number;
  created_at?: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [creditAmount, setCreditAmount] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login?redirect=/admin");
          return;
        }

        // Check if user is admin - we'll verify on the server side
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          const profileData = profile as {
            id: string;
            full_name?: string;
            credits_balance?: number;
            created_at?: string;
          };
          setCurrentUser({ 
            id: profileData.id,
            full_name: profileData.full_name,
            credits_balance: profileData.credits_balance,
            created_at: profileData.created_at,
            email: user.email || "" 
          });
        }

        // Fetch all users via API
        await fetchUsers();
      } catch (err) {
        console.error("Error checking admin:", err);
        setError("Error de autenticación");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          router.push("/dashboard");
          return;
        }
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Error al cargar usuarios");
    }
  };

  const handleAddCredits = async () => {
    if (!selectedUser || !creditAmount) return;

    try {
      const amount = parseFloat(creditAmount);
      if (isNaN(amount) || amount <= 0) {
        setError("Monto inválido");
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("No hay sesión activa");
        return;
      }

      const response = await fetch("/api/admin/add-credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          amount: amount,
          packageName: "Manual Admin",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al añadir créditos");
      }

      const data = await response.json();

      // Refresh users
      await fetchUsers();
      setSelectedUser(null);
      setCreditAmount("");
      setError(null);
      alert(`✅ +${amount} coins añadidos a ${selectedUser.full_name || selectedUser.email}. Nuevo balance: ${data.newBalance} coins`);
    } catch (err) {
      console.error("Error adding credits:", err);
      setError(err instanceof Error ? err.message : "Error al añadir créditos");
    }
  };

  const handleAddCreditsByEmail = async () => {
    if (!emailInput || !creditAmount) return;

    try {
      const amount = parseFloat(creditAmount);
      if (isNaN(amount) || amount <= 0) {
        setError("Monto inválido");
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("No hay sesión activa");
        return;
      }

      const response = await fetch("/api/admin/add-credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          email: emailInput,
          amount: amount,
          packageName: "Manual Admin by Email",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al añadir créditos");
      }

      const data = await response.json();

      // Refresh users
      await fetchUsers();
      setShowEmailModal(false);
      setEmailInput("");
      setCreditAmount("");
      setError(null);
      alert(`✅ +${amount} coins añadidos a ${emailInput}. Nuevo balance: ${data.newBalance} coins`);
    } catch (err) {
      console.error("Error adding credits:", err);
      setError(err instanceof Error ? err.message : "Error al añadir créditos");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E8E1D4] flex items-center justify-center">
        <div className="text-[#2E2E2E] text-lg font-medium">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8E1D4]">
      {/* Header */}
      <header className="bg-[#2E2E2E] text-white border-b border-gray-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-12">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-[family-name:var(--font-mona-sans)] text-sm font-bold">Admin</span>
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 hidden sm:inline">{currentUser?.email}</span>
              <button
                onClick={handleLogout}
                className="p-1.5 hover:bg-gray-700 rounded-md transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Stats Simple */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-[#737373] uppercase tracking-wide">Total Usuarios</p>
            <p className="text-2xl font-bold text-[#2E2E2E]">{users.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-[#737373] uppercase tracking-wide">Coins en Circulación</p>
            <p className="text-2xl font-bold text-[#2E2E2E]">
              {users.reduce((sum, u) => sum + (u.credits_balance || 0), 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm hidden md:block">
            <p className="text-xs text-[#737373] uppercase tracking-wide">Tu Balance</p>
            <p className="text-2xl font-bold text-[#2E2E2E]">{currentUser?.credits_balance || 0}</p>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setShowEmailModal(true)}
            className="inline-flex items-center px-4 py-2.5 bg-[#2E2E2E] text-white rounded-xl text-sm font-medium hover:bg-[#3E3E3E] transition-colors"
          >
            <Mail className="w-4 h-4 mr-2" />
            Añadir por Email
          </button>
          <button
            onClick={() => fetchUsers()}
            className="inline-flex items-center px-4 py-2.5 bg-white border border-[#E5E5E5] text-[#2E2E2E] rounded-xl text-sm font-medium hover:border-[#2E2E2E] transition-colors"
          >
            Actualizar Lista
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent shadow-sm"
            placeholder="Buscar usuario por email o nombre..."
          />
        </div>

        {/* Users List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#E5E5E5] bg-[#FAFAFA]">
            <h2 className="font-semibold text-[#2E2E2E]">
              Usuarios {filteredUsers.length > 0 && `(${filteredUsers.length})`}
            </h2>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-[#737373]">
              No se encontraron usuarios
            </div>
          ) : (
            <div className="divide-y divide-[#E5E5E5]">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-4 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2E2E2E] text-white flex items-center justify-center font-semibold text-sm">
                      {user.full_name?.charAt(0) || user.email?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="font-medium text-[#2E2E2E]">{user.full_name || "Sin nombre"}</p>
                      <p className="text-sm text-[#737373]">{user.email}</p>
                      <p className="text-xs text-gray-400">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString("es-ES") : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-[#2E2E2E]">{user.credits_balance || 0} coins</p>
                    </div>
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="inline-flex items-center px-3 py-2 bg-[#2E2E2E] text-white rounded-lg text-sm hover:bg-[#3E3E3E] transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Añadir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Credits Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">
              Añadir Coins
            </h3>
            <p className="text-[#3E3E3E] mb-4">
              Usuario: <strong>{selectedUser.full_name || selectedUser.email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Balance actual: {(selectedUser.credits_balance || 0)} coins
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#3E3E3E] mb-2">
                Cantidad de coins a añadir
              </label>
              <input
                type="number"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent"
                placeholder="0"
                min="1"
                step="1"
                autoFocus
              />
              {creditAmount && parseFloat(creditAmount) > 0 && (
                <p className="text-xs text-[#737373] mt-2">
                  Nuevo balance: <strong>{(selectedUser.credits_balance || 0) + parseFloat(creditAmount)} coins</strong>
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddCredits}
                disabled={!creditAmount || parseFloat(creditAmount) <= 0}
                className="flex-1 bg-[#2E2E2E] text-white py-3 rounded-xl font-semibold hover:bg-[#3E3E3E] transition-colors disabled:opacity-50"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Añadir Coins
              </button>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setCreditAmount("");
                }}
                className="flex-1 bg-gray-200 text-[#2E2E2E] py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Credits by Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">
              Añadir Coins por Email
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#3E3E3E] mb-2">
                Correo electrónico del usuario
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent"
                placeholder="usuario@ejemplo.com"
                autoFocus
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#3E3E3E] mb-2">
                Cantidad de coins a añadir
              </label>
              <input
                type="number"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent"
                placeholder="0"
                min="1"
                step="1"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddCreditsByEmail}
                disabled={!emailInput || !creditAmount || parseFloat(creditAmount) <= 0}
                className="flex-1 bg-[#2E2E2E] text-white py-3 rounded-xl font-semibold hover:bg-[#3E3E3E] transition-colors disabled:opacity-50"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Añadir Coins
              </button>
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setEmailInput("");
                  setCreditAmount("");
                }}
                className="flex-1 bg-gray-200 text-[#2E2E2E] py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
