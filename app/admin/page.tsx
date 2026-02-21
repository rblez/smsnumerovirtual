"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { SFIcon } from '@bradleyhodges/sfsymbols-react'
import { sfMagnifyingglass, sfPlus, sfArrowRight } from '@bradleyhodges/sfsymbols'

interface UserData {
  id: string;
  email?: string;
  full_name?: string;
  credits_balance?: number;
  created_at?: string;
  banned?: boolean;
  total_sms?: number;
  total_countries?: number;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedUserForBan, setSelectedUserForBan] = useState<UserData | null>(null);
  
  // New state for email credits modal with +/-
  const [showEmailCreditsModal, setShowEmailCreditsModal] = useState(false);
  const [emailCreditsInput, setEmailCreditsInput] = useState("");
  const [emailCreditsUser, setEmailCreditsUser] = useState<UserData | null>(null);
  const [emailCreditsBalance, setEmailCreditsBalance] = useState(0);
  const [emailCreditsAdjust, setEmailCreditsAdjust] = useState(0);
  
  // New state for notification confirmation modal
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationType, setNotificationType] = useState<'credits_added' | 'credits_removed' | 'banned' | 'unbanned' | null>(null);
  const [notificationUser, setNotificationUser] = useState<UserData | null>(null);
  const [notificationAmount, setNotificationAmount] = useState(0);
  
  const router = useRouter();

  const fetchUsers = useCallback(async () => {
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
          setError("access_denied");
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
  }, [router]);

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
  }, [router, fetchUsers]);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdjustCredits = async (amount: number) => {
    if (!selectedUser || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
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
          packageName: "Manual Admin Adjust",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al ajustar créditos");
      }

      const data = await response.json();

      await fetchUsers();
      setError(null);
      const action = amount > 0 ? "añadidos" : "removidos";
      alert(`✅ ${Math.abs(amount)} coins ${action}. Nuevo balance: ${data.newBalance} coins`);
    } catch (err) {
      console.error("Error adjusting credits:", err);
      setError(err instanceof Error ? err.message : "Error al ajustar créditos");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // Load user by email for credits modal
  const handleLoadUserByEmail = async () => {
    if (!emailCreditsInput) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("No hay sesión activa");
        return;
      }

      const response = await fetch(`/api/admin/users?email=${encodeURIComponent(emailCreditsInput)}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Usuario no encontrado");
      }

      const data = await response.json();
      if (data.users && data.users.length > 0) {
        const user = data.users[0];
        setEmailCreditsUser(user);
        setEmailCreditsBalance(user.credits_balance || 0);
        setEmailCreditsAdjust(0);
      } else {
        setError("Usuario no encontrado");
        setEmailCreditsUser(null);
      }
    } catch (err) {
      console.error("Error loading user:", err);
      setError(err instanceof Error ? err.message : "Error al cargar usuario");
      setEmailCreditsUser(null);
    }
  };

  // Save credits and show notification modal
  const handleSaveEmailCredits = async () => {
    if (!emailCreditsUser || emailCreditsAdjust === 0) return;
    
    setIsSubmitting(true);
    
    try {
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
          userId: emailCreditsUser.id,
          amount: emailCreditsAdjust,
          packageName: "Manual Admin via Email",
        }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar créditos");
      }

      // Close email modal and show notification modal
      
      // Close email modal and show notification modal
      setShowEmailCreditsModal(false);
      setNotificationType(emailCreditsAdjust > 0 ? 'credits_added' : 'credits_removed');
      setNotificationUser(emailCreditsUser);
      setNotificationAmount(Math.abs(emailCreditsAdjust));
      setShowNotificationModal(true);
      
      // Reset email modal state
      setEmailCreditsInput("");
      setEmailCreditsUser(null);
      setEmailCreditsBalance(0);
      setEmailCreditsAdjust(0);
      
      // Refresh users
      await fetchUsers();
    } catch (err) {
      console.error("Error saving credits:", err);
      setError(err instanceof Error ? err.message : "Error al guardar créditos");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle ban with notification
  const handleBanWithNotification = async (user: UserData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("No hay sesión activa");
        return;
      }

      const response = await fetch("/api/admin/toggle-ban", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          banned: !user.banned,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al cambiar estado de baneo");
      }

      await fetchUsers();
      setShowBanModal(false);
      setSelectedUserForBan(null);
      
      // Show notification modal
      setNotificationType(user.banned ? 'unbanned' : 'banned');
      setNotificationUser(user);
      setNotificationAmount(0);
      setShowNotificationModal(true);
    } catch (err) {
      console.error("Error toggling ban:", err);
      setError(err instanceof Error ? err.message : "Error al cambiar estado de baneo");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Send notification email
  const handleSendNotification = async () => {
    if (!notificationUser || !notificationType) return;
    
    setIsSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("No hay sesión activa");
        return;
      }

      const response = await fetch("/api/admin/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          userId: notificationUser.id,
          email: notificationUser.email,
          type: notificationType,
          amount: notificationAmount,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar notificación");
      }

      setShowNotificationModal(false);
      setNotificationUser(null);
      setNotificationType(null);
      setNotificationAmount(0);
      alert("✅ Notificación enviada correctamente");
    } catch (err) {
      console.error("Error sending notification:", err);
      alert("❌ Error al enviar notificación");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modify search to call API for email searches
  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm.trim()) {
        // If search is empty, load all users
        await fetchUsers();
        return;
      }

      // Check if searchTerm looks like an email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(searchTerm.trim())) {
        // Search by email via API
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) return;

          const response = await fetch(`/api/admin/users?email=${encodeURIComponent(searchTerm.trim())}`, {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUsers(data.users || []);
          }
        } catch (error) {
          console.error("Search error:", error);
        }
      } else {
        // For non-email searches, filter local results
        // Results will be shown from the current users state
      }
    };

    const timeoutId = setTimeout(performSearch, 300); // Debounce search
    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchUsers, users]);

  const handleRowClick = (user: UserData) => {
    setSelectedUser(user);
  };

  if (loading) {
    return null;
  }

  if (error === "access_denied") {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-6xl md:text-8xl font-normal text-[#2E2E2E] tracking-[-0.04em] mb-4">404</h1>
          <p className="font-sans text-xl md:text-2xl text-[#737373] tracking-[-0.01em] mb-8">Esta ruta no existe</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-[#2E2E2E] text-white px-8 py-4 rounded-full font-mono text-xs tracking-wider uppercase hover:bg-[#3E3E3E] transition-colors">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#2E2E2E] text-white border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-3">
              <span className="text-sm font-bold font-mono tracking-wider">ADMIN</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400 hidden sm:inline font-mono tracking-wider">{currentUser?.email}</span>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Cerrar sesión"
              >
                <SFIcon icon={sfArrowRight} size={18} color="currentColor" />
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E5E5E5]">
            <p className="font-mono text-[10px] text-[#737373] tracking-wider uppercase mb-2">Total Usuarios</p>
            <p className="font-display text-3xl font-normal text-[#2E2E2E] tracking-[-0.02em]">{users.length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E5E5E5]">
            <p className="font-mono text-[10px] text-[#737373] tracking-wider uppercase mb-2">Coins en Circulación</p>
            <p className="font-display text-3xl font-normal text-[#2E2E2E] tracking-[-0.02em]">
              {users.reduce((sum, u) => sum + (u.credits_balance || 0), 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E5E5E5] hidden md:block">
            <p className="font-mono text-[10px] text-[#737373] tracking-wider uppercase mb-2">Tu Balance</p>
            <p className="font-display text-3xl font-normal text-[#2E2E2E] tracking-[-0.02em]">{currentUser?.credits_balance || 0}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <SFIcon icon={sfMagnifyingglass} size={20} color="#9CA3AF" className="absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent shadow-sm"
            placeholder="Buscar usuario por email..."
          />
        </div>

        {/* Users List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#E5E5E5] bg-[#FAFAFA]">
            <h2 className="font-semibold text-[#2E2E2E]">
              Usuarios {users.length > 0 && `(${users.length})`}
            </h2>
          </div>

          {users.length === 0 ? (
            <div className="p-12 text-center text-[#737373]">
              No se encontraron usuarios
            </div>
          ) : (
            <div className="divide-y divide-[#E5E5E5]">
              {/* Header row */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-3 bg-gray-50 text-xs text-[#737373] font-medium">
                <div className="col-span-4">Email / Nombre</div>
                <div className="col-span-2 text-center">Total SMS</div>
                <div className="col-span-2 text-center">Países</div>
                <div className="col-span-2 text-center">Coins</div>
                <div className="col-span-2 text-right">Acciones</div>
              </div>
              
              {users.map((user) => (
                <div 
                  key={user.id} 
                  onClick={() => handleRowClick(user)}
                  className={`p-4 md:grid md:grid-cols-12 md:gap-4 md:items-center hover:bg-[#FAFAFA] transition-colors cursor-pointer ${user.banned ? 'bg-red-50/50' : ''}`}
                >
                  {/* Email/Name column */}
                  <div className="col-span-4 flex items-center gap-3 mb-3 md:mb-0">
                    <div className={`w-10 h-10 rounded-full ${user.banned ? 'bg-red-500' : 'bg-[#2E2E2E]'} text-white flex items-center justify-center font-semibold text-sm shrink-0`}>
                      {user.full_name?.charAt(0) || user.email?.charAt(0) || "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-[#2E2E2E] truncate">
                        {user.email}
                        {user.banned && <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">BANEADO</span>}
                      </p>
                      <p className="text-xs text-[#737373]">{user.full_name || "Sin nombre"}</p>
                    </div>
                  </div>
                  
                  {/* SMS count */}
                  <div className="col-span-2 text-center mb-2 md:mb-0">
                    <span className="md:hidden text-xs text-[#737373]">SMS: </span>
                    <span className="font-semibold text-[#2E2E2E]">{user.total_sms || 0}</span>
                  </div>
                  
                  {/* Countries */}
                  <div className="col-span-2 text-center mb-2 md:mb-0">
                    <span className="md:hidden text-xs text-[#737373]">Países: </span>
                    <span className="font-semibold text-[#2E2E2E]">{user.total_countries || 0}</span>
                  </div>
                  
                  {/* Coins */}
                  <div className="col-span-2 text-center mb-2 md:mb-0">
                    <span className="md:hidden text-xs text-[#737373]">Coins: </span>
                    <span className="font-semibold text-[#2E2E2E]">{user.credits_balance || 0}</span>
                  </div>
                  
                  {/* Actions: only Suspend */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    {/* Suspend/Ban button */}
                    <button
                      onClick={() => {
                        setSelectedUserForBan(user);
                        setShowBanModal(true);
                      }}
                      disabled={isSubmitting}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50 ${user.banned ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                    >
                      {user.banned ? 'Activar' : 'Suspender'}
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
              <label className="block text-sm font-medium text-[#3E3E3E] mb-3">
                Ajustar coins
              </label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[-100, -50, -10, -1].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAdjustCredits(amount)}
                    disabled={isSubmitting || (selectedUser.credits_balance || 0) + amount < 0}
                    className="py-2 px-3 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {amount}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 10, 50, 100].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAdjustCredits(amount)}
                    disabled={isSubmitting}
                    className="py-2 px-3 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold hover:bg-emerald-200 transition-colors disabled:opacity-50"
                  >
                    +{amount}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#737373] mt-3 text-center">
                {isSubmitting ? 'Procesando...' : 'Click para añadir o quitar coins instantáneamente'}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setCreditAmount("");
                }}
                className="flex-1 bg-gray-200 text-[#2E2E2E] py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Cerrar
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
                <SFIcon icon={sfPlus} size={20} color="currentColor" className="inline mr-2" />
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

      {/* Ban/Unban Confirmation Modal */}
      {showBanModal && selectedUserForBan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">
              {selectedUserForBan.banned ? 'Desbanear Usuario' : 'Banear Usuario'}
            </h3>
            <p className="text-[#3E3E3E] mb-4">
              Usuario: <strong>{selectedUserForBan.full_name || selectedUserForBan.email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {selectedUserForBan.banned 
                ? 'El usuario podrá volver a acceder a la plataforma.' 
                : 'El usuario perderá acceso a la plataforma inmediatamente.'}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => handleBanWithNotification(selectedUserForBan)}
                disabled={isSubmitting}
                className={`flex-1 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 ${
                  selectedUserForBan.banned 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isSubmitting ? 'Procesando...' : (selectedUserForBan.banned ? 'Desbanear' : 'Banear')}
              </button>
              <button
                onClick={() => {
                  setShowBanModal(false);
                  setSelectedUserForBan(null);
                }}
                disabled={isSubmitting}
                className="flex-1 bg-gray-200 text-[#2E2E2E] py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Credits Modal with +/- */}
      {showEmailCreditsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">
              Añadir Coins por Email
            </h3>

            {!emailCreditsUser ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#3E3E3E] mb-2">
                    Correo electrónico del usuario
                  </label>
                  <input
                    type="email"
                    value={emailCreditsInput}
                    onChange={(e) => setEmailCreditsInput(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent"
                    placeholder="usuario@ejemplo.com"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleLoadUserByEmail}
                    disabled={!emailCreditsInput || isSubmitting}
                    className="flex-1 bg-[#2E2E2E] text-white py-3 rounded-xl font-semibold hover:bg-[#3E3E3E] transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Buscando...' : 'Buscar Usuario'}
                  </button>
                  <button
                    onClick={() => {
                      setShowEmailCreditsModal(false);
                      setEmailCreditsInput("");
                    }}
                    className="flex-1 bg-gray-200 text-[#2E2E2E] py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-[#3E3E3E] mb-4">
                  Usuario: <strong>{emailCreditsUser.full_name || emailCreditsUser.email}</strong>
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Balance actual: {emailCreditsBalance} coins
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Ajuste: <span className={emailCreditsAdjust >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {emailCreditsAdjust > 0 ? '+' : ''}{emailCreditsAdjust}
                  </span>
                  {' → '}
                  Nuevo balance: <strong>{emailCreditsBalance + emailCreditsAdjust}</strong>
                </p>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#3E3E3E] mb-3">
                    Cantidad de coins a ajustar
                  </label>
                  <input
                    type="number"
                    value={emailCreditsAdjust}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      if (emailCreditsBalance + value >= 0) {
                        setEmailCreditsAdjust(value);
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent text-center text-lg font-semibold"
                    placeholder="0"
                    min={-emailCreditsBalance}
                    step="1"
                  />
                  <p className="text-xs text-[#737373] mt-2 text-center">
                    Usa números positivos para añadir, negativos para quitar
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSaveEmailCredits}
                    disabled={isSubmitting || emailCreditsAdjust === 0}
                    className="flex-1 bg-[#2E2E2E] text-white py-3 rounded-xl font-semibold hover:bg-[#3E3E3E] transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                  <button
                    onClick={() => {
                      setEmailCreditsUser(null);
                      setEmailCreditsAdjust(0);
                    }}
                    className="flex-1 bg-gray-200 text-[#2E2E2E] py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Volver
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Notification Confirmation Modal */}
      {showNotificationModal && notificationUser && notificationType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-[#2E2E2E] mb-4">
              Notificar al Usuario
            </h3>
            <p className="text-[#3E3E3E] mb-4">
              Usuario: <strong>{notificationUser.full_name || notificationUser.email}</strong>
            </p>
            <p className="text-sm text-gray-600 mb-6">
              {notificationType === 'credits_added' && `Se añadieron ${notificationAmount} coins a su cuenta.`}
              {notificationType === 'credits_removed' && `Se retiraron ${notificationAmount} coins de su cuenta.`}
              {notificationType === 'banned' && 'Su cuenta ha sido suspendida.'}
              {notificationType === 'unbanned' && 'Su cuenta ha sido reactivada.'}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              ¿Deseas enviar un email de notificación al usuario?
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleSendNotification}
                disabled={isSubmitting}
                className="flex-1 bg-[#2E2E2E] text-white py-3 rounded-xl font-semibold hover:bg-[#3E3E3E] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Sí, Notificar'}
              </button>
              <button
                onClick={() => {
                  setShowNotificationModal(false);
                  setNotificationUser(null);
                  setNotificationType(null);
                  setNotificationAmount(0);
                }}
                className="flex-1 bg-gray-200 text-[#2E2E2E] py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                No, Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © 2026 SMS Número Virtual. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
                Términos de Servicio
              </Link>
              <Link href="/privacy" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
                Políticas de Privacidad
              </Link>
              <span className="text-gray-300">|</span>
              <a href="https://t.me/smsnumerovirtual" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
