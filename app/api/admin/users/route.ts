import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdminAccess } from "@/lib/admin-check";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    // Verify admin access using centralized function
    const auth = await verifyAdminAccess(request);
    if (!auth.success) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status || 403 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Get email filter from query params
    const { searchParams } = new URL(request.url);
    const emailFilter = searchParams.get('email');

    // Fetch auth users to get emails
    const { data: { users: authUsers }, error: authError } = await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      console.warn("Could not fetch auth users:", authError);
    }

    // If email filter provided, find matching user (case-insensitive)
    let targetUserId: string | null = null;
    if (emailFilter && authUsers) {
      const matchedUser = authUsers.find(au => au.email?.toLowerCase() === emailFilter.toLowerCase());
      if (matchedUser) {
        targetUserId = matchedUser.id;
      } else {
        return NextResponse.json({ users: [] });
      }
    }

    // Fetch profiles (filtered if email provided)
    let profilesQuery = supabaseAdmin
      .from("profiles")
      .select("*");
    
    if (targetUserId) {
      profilesQuery = profilesQuery.eq("id", targetUserId);
    }
    
    const { data: profiles, error: profilesError } = await profilesQuery
      .order("created_at", { ascending: false });

    if (profilesError) {
      throw profilesError;
    }

    // If no profiles found and email filter was provided
    if (targetUserId && (!profiles || profiles.length === 0)) {
      return NextResponse.json({ users: [] });
    }

    // Fetch SMS stats for each user
    const { data: smsHistory, error: smsError } = await supabaseAdmin
      .from("sms_history")
      .select("user_id, country");

    if (smsError) {
      console.warn("Could not fetch SMS history:", smsError);
    }

    // Calculate stats per user
    const smsStats: Record<string, { total_sms: number; countries: Set<string> }> = {};
    (smsHistory || []).forEach((sms) => {
      if (!smsStats[sms.user_id]) {
        smsStats[sms.user_id] = { total_sms: 0, countries: new Set() };
      }
      smsStats[sms.user_id].total_sms++;
      if (sms.country) {
        smsStats[sms.user_id].countries.add(sms.country);
      }
    });

    // Merge profiles with auth user emails and stats
    const usersWithEmails = (profiles || []).map((profile) => {
      const authUser = authUsers?.find((au) => au.id === profile.id);
      const stats = smsStats[profile.id];
      return {
        ...profile,
        email: authUser?.email || undefined,
        total_sms: stats?.total_sms || 0,
        total_countries: stats?.countries?.size || 0,
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

