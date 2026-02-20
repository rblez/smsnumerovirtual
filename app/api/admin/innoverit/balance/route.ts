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

    // Call Innoverit API to get balance
    const INNOVERIT_API_KEY = process.env.INNOVERIT_API_KEY;
    if (!INNOVERIT_API_KEY) {
      return NextResponse.json(
        { error: "Server configuration error: Missing API key" },
        { status: 500 }
      );
    }

    // Try to get balance from Innoverit
    // Based on typical SMS APIs, we'll try common balance endpoints
    const balanceEndpoints = [
      `https://www.innoverit.com/api/v2/balance?apikey=${INNOVERIT_API_KEY}`,
      `https://www.innoverit.com/api/v2/account/balance?apikey=${INNOVERIT_API_KEY}`,
    ];

    let balanceData = null;
    let errorMsg = null;

    for (const endpoint of balanceEndpoints) {
      try {
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          balanceData = data;
          break;
        }
      } catch (err) {
        errorMsg = err instanceof Error ? err.message : "Unknown error";
        continue;
      }
    }

    // If no balance endpoint worked, return a mock/simulated response
    // This allows the UI to work while we figure out the correct endpoint
    if (!balanceData) {
      return NextResponse.json({
        balance: 0,
        currency: "USD",
        status: "unknown",
        message: "Balance endpoint not available - using placeholder",
        error: errorMsg,
        apiKeyConfigured: true,
      });
    }

    return NextResponse.json({
      balance: balanceData.balance || balanceData.credits || 0,
      currency: balanceData.currency || "USD",
      status: balanceData.status || "active",
      raw: balanceData,
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
