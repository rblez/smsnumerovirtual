import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    // Get user session from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
    
    // Verify user
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const adminEmails = ['rblez@proton.me'];
    if (!user.email || !adminEmails.includes(user.email)) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Fetch all profiles
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profilesError) {
      throw profilesError;
    }

    // Fetch auth users to get emails
    const { data: { users: authUsers }, error: authError } = await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      console.warn("Could not fetch auth users:", authError);
    }

    // Merge profiles with auth user emails
    const usersWithEmails = (profiles || []).map(profile => {
      const authUser = authUsers?.find(au => au.id === profile.id);
      return {
        ...profile,
        email: authUser?.email || undefined,
      };
    });

    return NextResponse.json({ users: usersWithEmails });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

