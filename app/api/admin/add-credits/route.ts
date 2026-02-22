import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdminAccess } from "@/lib/admin-check";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
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

    // Parse request body
    const { userId, email, amount, packageName } = await request.json();

    let targetUserId = userId;

    // If email is provided instead of userId, find the user by email (case-insensitive)
    if (!targetUserId && email) {
      const { data: { users: authUsers }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (listError) {
        return NextResponse.json(
          { error: "Failed to list users" },
          { status: 500 }
        );
      }

      const targetUser = authUsers?.find(u => u.email?.toLowerCase() === email.toLowerCase());
      if (!targetUser) {
        return NextResponse.json(
          { error: "User not found with that email" },
          { status: 404 }
        );
      }
      targetUserId = targetUser.id;
    }

    if (!targetUserId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: userId or email, and amount" },
        { status: 400 }
      );
    }

    const creditAmount = parseFloat(amount);
    if (isNaN(creditAmount) || creditAmount === 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // Get current balance
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("credits_balance")
      .eq("id", targetUserId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Check if subtracting more than available
    const newBalance = profile.credits_balance + creditAmount;
    if (newBalance < 0) {
      return NextResponse.json(
        { error: "Cannot subtract more credits than user has" },
        { status: 400 }
      );
    }

    // Update credits
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ credits_balance: newBalance })
      .eq("id", targetUserId);

    if (updateError) {
      throw updateError;
    }

    // Record credit purchase/adjustment
    const { error: purchaseError } = await supabaseAdmin
      .from("credit_purchases")
      .insert({
        user_id: targetUserId,
        amount: creditAmount,
        package_name: packageName || (creditAmount > 0 ? "Manual Admin Add" : "Manual Admin Subtract"),
        payment_method: "admin_manual",
        status: "completed",
        admin_notes: `${creditAmount > 0 ? 'Added' : 'Subtracted'} by admin: ${auth.user?.email || 'unknown'}`,
      });

    if (purchaseError) {
      console.error("Failed to record credit purchase:", purchaseError);
      // Don't fail the request if purchase recording fails
    }

    return NextResponse.json({
      success: true,
      newBalance,
      message: `Added $${creditAmount.toFixed(2)} USD to user account`,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

