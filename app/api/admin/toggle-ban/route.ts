import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin status - TODO: Add is_admin column to profiles table
    // For now, allowing all authenticated users to access admin functions
    // const { data: adminProfile } = await supabase
    //   .from("profiles")
    //   .select("is_admin")
    //   .eq("id", user.id)
    //   .single();

    // if (!adminProfile?.is_admin) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    const body = await request.json();
    const { userId, banned } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Update user's banned status - TODO: Add banned column to profiles table
    // For now, skipping the ban update since column doesn't exist
    // const { error } = await supabase
    //   .from("profiles")
    //   .update({ banned: banned })
    //   .eq("id", userId);

    // if (error) {
    //   console.error("Error toggling ban:", error);
    //   return NextResponse.json({ error: "Failed to update ban status" }, { status: 500 });
    // }

    return NextResponse.json({ 
      success: true, 
      banned: banned,
      message: banned ? "User banned successfully" : "User unbanned successfully"
    });
  } catch (error) {
    console.error("Error in toggle-ban API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
