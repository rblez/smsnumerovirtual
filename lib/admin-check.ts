import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Hardcoded admin emails - these users always have admin access
export const ADMIN_EMAILS = [
  'pedroenriquebar@gmail.com',
  'rblez@proton.me'
];

/**
 * Check if an email is in the admin list (case-insensitive)
 */
export function isAdminEmail(email: string): boolean {
  const normalizedEmail = email.toLowerCase().trim();
  return ADMIN_EMAILS.includes(normalizedEmail);
}

/**
 * Check if a user has admin role by checking their profile or hardcoded email
 */
export async function isUserAdmin(userId: string, email?: string): Promise<boolean> {
  try {
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // First check if email is in hardcoded admin list
    if (email && isAdminEmail(email)) {
      return true;
    }

    // Otherwise check role in profiles table
    const { data: userProfile, error } = await supabaseAdmin
      .from("profiles")
      .select("role, email")
      .eq("id", userId)
      .single();

    if (error || !userProfile) {
      return false;
    }

    // Check role or email in profile
    return userProfile.role === 'admin' || 
           (userProfile.email && isAdminEmail(userProfile.email));
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
}

/**
 * Verify admin access from request headers
 */
export async function verifyAdminAccess(request: Request): Promise<{ 
  success: boolean; 
  user?: { id: string; email?: string }; 
  error?: string;
  status?: number;
}> {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return { success: false, error: "Unauthorized", status: 401 };
    }

    const token = authHeader.split(" ")[1];
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
    
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      return { success: false, error: "Invalid token", status: 401 };
    }

    const isAdmin = await isUserAdmin(user.id, user.email);
    if (!isAdmin) {
      return { success: false, error: "Forbidden - Admin access required", status: 403 };
    }

    return { success: true, user: { id: user.id, email: user.email || undefined } };
  } catch (error) {
    console.error("Error verifying admin access:", error);
    return { success: false, error: "Internal server error", status: 500 };
  }
}
