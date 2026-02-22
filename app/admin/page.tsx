"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { notFound } from 'next/navigation';
import { SFIcon } from '@bradleyhodges/sfsymbols-react'
import { sfMagnifyingglass, sfArrowRight } from '@bradleyhodges/sfsymbols'
import { Plus } from 'lucide-react'
import { isAdminEmail } from '@/lib/admin-check'
import { SpinnerCustom as Spinner } from '@/app/components/spinner'
import Button from '@/app/components/ui/Button'
import Input from '@/app/components/ui/Input'
import Card from '@/app/components/ui/Card'

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
  
  // New state for email credits modal with +/-
  const [showEmailCreditsModal, setShowEmailCreditsModal] = useState(false);
  const [emailCreditsInput, setEmailCreditsInput] = useState("");
  const [emailCreditsUser, setEmailCreditsUser] = useState<UserData | null>(null);
  const [emailCreditsBalance, setEmailCreditsBalance] = useState(0);
  const [emailCreditsAdjust, setEmailCreditsAdjust] = useState(0);
  
  // New state for flexible quantity adjustment
  const [quantityInputValue, setQuantityInputValue] = useState("");
  const [quantityAdjustmentType, setQuantityAdjustmentType] = useState<'reducir' | 'aumentar' | null>(null);
  
  // Notification modal state
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationUser, setNotificationUser] = useState<UserData | null>(null);
  const [notificationType, setNotificationType] = useState<'credits_added' | 'credits_removed' | 'banned' | 'unbanned' | null>(null);
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

        // Check if user email is in the allowed admin list (case-insensitive)
        if (!user.email || !isAdminEmail(user.email)) {
          setError("not_found");
          return;
        }

        // Check if user has admin role in profiles table
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
    console.log('[DEBUG] handleAddCreditsByEmail called', { emailInput, creditAmount, isSubmitting });
    
    if (!emailInput || !creditAmount) {
      console.log('[DEBUG] Early return - missing email or amount');
      return;
    }
    
    if (isSubmitting) {
      console.log('[DEBUG] BLOCKED - Already submitting');
      alert('⏳ Proceso en curso, por favor espera...');
      return;
    }

    try {
      const amount = parseFloat(creditAmount);
      if (isNaN(amount) || amount <= 0) {
        console.log('[DEBUG] Invalid amount');
        setError("Monto inválido");
        return;
      }
      
      console.log('[DEBUG] Setting isSubmitting = true');
      setIsSubmitting(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('[DEBUG] No active session');
        setError("No hay sesión activa");
        return;
      }

      console.log('[DEBUG] Making API call', { email: emailInput, amount });
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

      console.log('[DEBUG] Response received', { status: response.status, ok: response.ok });
      
      if (!response.ok) {
        const data = await response.json();
        console.log('[DEBUG] Error response', data);
        throw new Error(data.error || "Error al añadir créditos");
      }

      const data = await response.json();
      console.log('[DEBUG] Success', data);

      // Refresh users
      await fetchUsers();
      setShowEmailModal(false);
      setEmailInput("");
      setCreditAmount("");
      setError(null);
      // Success - coins added (notification removed)
    } catch (err) {
      console.error('[DEBUG] Error in handleAddCreditsByEmail:', err);
      setError(err instanceof Error ? err.message : "Error al añadir créditos");
    } finally {
      console.log('[DEBUG] Setting isSubmitting = false');
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
    console.log('[DEBUG] handleSaveEmailCredits called', { emailCreditsUser: emailCreditsUser?.id, emailCreditsAdjust, isSubmitting });
    
    if (!emailCreditsUser || emailCreditsAdjust === 0) {
      console.log('[DEBUG] Early return - no user or zero adjustment');
      return;
    }
    
    // EXTRA GUARD
    if (isSubmitting) {
      console.log('[DEBUG] BLOCKED - Already submitting');
      return;
    }
    
    // Validate balance won't go negative
    if (emailCreditsBalance + emailCreditsAdjust < 0) {
      console.log('[DEBUG] Would go negative');
      setError(`No se puede reducir más allá del balance actual (${emailCreditsBalance} coins)`);
      return;
    }
    
    console.log('[DEBUG] Setting isSubmitting = true');
    setIsSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('[DEBUG] No active session');
        setError("No hay sesión activa");
        return;
      }

      console.log('[DEBUG] Making API call', { userId: emailCreditsUser.id, amount: emailCreditsAdjust });
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

      console.log('[DEBUG] Response received', { status: response.status, ok: response.ok });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('[DEBUG] Error response', errorData);
        throw new Error("Error al guardar créditos");
      }

      const result = await response.json();
      console.log('[DEBUG] Success', result);

      // Close email modal
      setShowEmailCreditsModal(false);
      
      // Reset email modal state
      setEmailCreditsInput("");
      setEmailCreditsUser(null);
      setEmailCreditsBalance(0);
      setEmailCreditsAdjust(0);
      
      // Refresh users
      await fetchUsers();
      setError(null);
      // Success - coins added (notification removed)
    } catch (err) {
      console.error('[DEBUG] Error in handleSaveEmailCredits:', err);
      setError(err instanceof Error ? err.message : "Error al guardar créditos");
    } finally {
      console.log('[DEBUG] Setting isSubmitting = false');
      setIsSubmitting(false);
    }
  };

  // Handle flexible quantity adjustment - DEBUG MODE
  const handleFlexibleQuantityAdjustment = async () => {
    console.log('[DEBUG] handleFlexibleQuantityAdjustment called', {
      selectedUser: selectedUser?.id,
      quantityInputValue,
      isSubmitting,
      timestamp: new Date().toISOString()
    });
    
    if (!selectedUser || !quantityInputValue) {
      console.log('[DEBUG] Early return - missing user or value');
      return;
    }

    // EXTRA GUARD: Prevent any execution if already submitting
    if (isSubmitting) {
      console.log('[DEBUG] BLOCKED - Already submitting, preventing double execution');
      return;
    }

    const amount = parseInt(quantityInputValue);
    console.log('[DEBUG] Parsed amount:', amount);
    
    if (isNaN(amount) || amount <= 0) {
      console.log('[DEBUG] Invalid amount');
      setError("Cantidad inválida");
      return;
    }

    console.log('[DEBUG] Setting isSubmitting = true');
    setIsSubmitting(true);

    try {
      console.log('[DEBUG] Starting API call to add-credits');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('[DEBUG] No active session');
        setError("No hay sesión activa");
        return;
      }

      console.log('[DEBUG] Making fetch request', { userId: selectedUser.id, amount });
      const response = await fetch("/api/admin/add-credits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          amount: amount,
          packageName: "Manual Admin Add",
        }),
      });

      console.log('[DEBUG] Response received', { status: response.status, ok: response.ok });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log('[DEBUG] Error response', errorData);
        throw new Error(errorData.error || "Error al añadir créditos");
      }

      const result = await response.json();
      console.log('[DEBUG] Success response', result);

      // Close modal and show success
      setSelectedUser(null);
      setQuantityInputValue("");
      setQuantityAdjustmentType(null);
      setError(null);
      console.log('[DEBUG] State reset complete - coins added successfully');

      // Refresh users
      console.log('[DEBUG] Refreshing users list');
      await fetchUsers();
      console.log('[DEBUG] Users list refreshed');
    } catch (err) {
      console.error('[DEBUG] Error in handleFlexibleQuantityAdjustment:', err);
      setError(err instanceof Error ? err.message : "Error al añadir créditos");
    } finally {
      console.log('[DEBUG] Setting isSubmitting = false');
      setIsSubmitting(false);
    }
  };

  // Send notification email
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

  // Handle send notification to user
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
          type: notificationType,
          amount: notificationAmount,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar notificación");
      }

      // Close notification modal
      setShowNotificationModal(false);
      setNotificationUser(null);
      setNotificationType(null);
      setNotificationAmount(0);
      
      alert("✅ Notificación enviada exitosamente");
    } catch (err) {
      console.error("Error sending notification:", err);
      setError(err instanceof Error ? err.message : "Error al enviar notificación");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error === "access_denied" || error === "not_found") {
    notFound();
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
        <div className="grid grid-cols-2 gap-4 mb-8">
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
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Header row */}
                <div className="grid grid-cols-12 gap-4 p-3 bg-gray-50 text-xs text-[#737373] font-medium border-b border-[#E5E5E5]">
                  <div className="col-span-6">Usuario</div>
                  <div className="col-span-2 text-center">Total SMS</div>
                  <div className="col-span-2 text-center">Países</div>
                  <div className="col-span-2 text-center">Coins</div>
                </div>
                
                {users.map((user) => (
                  <div 
                    key={user.id} 
                    onClick={() => handleRowClick(user)}
                    className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-[#FAFAFA] transition-colors cursor-pointer border-b border-[#E5E5E5] last:border-b-0 ${user.banned ? 'bg-red-50/50' : ''}`}
                  >
                    {/* User column */}
                    <div className="col-span-6 flex items-center gap-3">
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
                    
                    {/* Total SMS */}
                    <div className="col-span-2 text-center">
                      <span className="font-semibold text-[#2E2E2E]">{user.total_sms || 0}</span>
                    </div>
                    
                    {/* Países */}
                    <div className="col-span-2 text-center">
                      <span className="font-semibold text-[#2E2E2E]">{user.total_countries || 0}</span>
                    </div>
                    
                    {/* Coins */}
                    <div className="col-span-2 text-center">
                      <span className="font-semibold text-[#2E2E2E]">{user.credits_balance || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Credits Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-[420px] p-0 shadow-2xl border-0">
            {/* Clean Header */}
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#2E2E2E]">
                    Agregar Coins
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedUser.full_name || selectedUser.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Balance Cards - Side by Side */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Balance Actual</p>
                  <p className="text-xl font-bold text-slate-700">{selectedUser.credits_balance || 0}</p>
                  <p className="text-xs text-slate-400">coins</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-100">
                  <p className="text-xs text-emerald-600 mb-1">Nuevo Balance</p>
                  <p className="text-xl font-bold text-emerald-600">{(selectedUser.credits_balance || 0) + (parseInt(quantityInputValue) || 0)}</p>
                  <p className="text-xs text-emerald-400">coins</p>
                </div>
              </div>

              {/* Amount Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad a añadir
                  </label>
                  <div className="flex justify-center">
                    <input
                      type="number"
                      value={quantityInputValue}
                      onChange={(e) => setQuantityInputValue(e.target.value)}
                      className="w-32 text-center text-4xl font-semibold py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-0 transition-all"
                      placeholder="0"
                      min="1"
                      step="1"
                    />
                  </div>
                </div>

                {/* Quick Amount Buttons - Pill Style */}
                <div className="flex justify-center gap-2">
                  {[5, 10, 25, 50].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setQuantityInputValue(amount.toString())}
                      className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                        quantityInputValue === amount.toString()
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      +{amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="secondary"
                  size="lg"
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border-0"
                  onClick={() => {
                    setSelectedUser(null);
                    setQuantityInputValue('');
                    setQuantityAdjustmentType(null);
                    setError(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                  disabled={isSubmitting || !quantityInputValue || parseInt(quantityInputValue) <= 0}
                  onClick={(e) => {
                    console.log('[DEBUG] Button clicked', { isSubmitting, quantityInputValue, timestamp: new Date().toISOString() });
                    e.preventDefault();
                    e.stopPropagation();
                    handleFlexibleQuantityAdjustment();
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Procesando...
                    </span>
                  ) : (
                    'Añadir'
                  )}
                </Button>
              </div>
            </div>
          </Card>
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
                <Plus size={20} className="inline mr-2" />
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
                      // Prevent negative values to avoid confusion
                      const safeValue = Math.max(0, value);
                      if (emailCreditsBalance + safeValue >= 0) {
                        setEmailCreditsAdjust(safeValue);
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2E2E2E] focus:border-transparent text-center text-lg font-semibold"
                    placeholder="0"
                    min="0"
                    step="1"
                  />
                  <p className="text-xs text-[#737373] mt-2 text-center">
                    Solo números positivos para añadir, usa el modal principal para reducir
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

      {/* Footer */}
      <footer className="pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © 2026 SMS Número Virtual. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/terms-of-service" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
                Términos de Servicio
              </Link>
              <Link href="/privacy-policy" className="text-gray-500 hover:text-gray-900 transition-colors text-sm">
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
