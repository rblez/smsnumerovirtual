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

    // Get email filter from query params
    const { searchParams } = new URL(request.url);
    const emailFilter = searchParams.get('email');

    // Fetch auth users to get emails
    const { data: { users: authUsers }, error: authError } = await supabaseAdmin.auth.admin.listUsers();

    if (authError) {
      console.warn("Could not fetch auth users:", authError);
    }

    // If email filter provided, find matching user
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

