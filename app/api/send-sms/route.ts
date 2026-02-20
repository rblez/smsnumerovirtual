import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Simple in-memory rate limiter: max 10 SMS per minute per user
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10; // 10 SMS per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in ms

function checkRateLimit(userId: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const record = rateLimitMap.get(userId);
  
  if (!record || now > record.resetTime) {
    // New window or expired
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetIn: RATE_LIMIT_WINDOW };
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    // Rate limit exceeded
    return { allowed: false, remaining: 0, resetIn: record.resetTime - now };
  }
  
  // Increment count
  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count, resetIn: record.resetTime - now };
}

interface InnoveritResponse {
  error_code: number;
  status: string;
  message: string;
  delivery_status?: string;
  destination?: string;
  content?: string;
  idsms?: number;
  cost?: string;
  iso?: string;
  balance?: number;
}

// Calculate coins cost based on country
function getCoinsCost(phoneNumber: string): number {
  const clean = phoneNumber.replace(/[^\d+]/g, "");
  
  // Cuba and USA/Canada: 1 coin
  if (clean.startsWith("+53")) return 1;
  if (clean.startsWith("+1")) return 1;
  
  // Tier 2: 2 coins
  if (clean.startsWith("+52")) return 2; // Mexico
  if (clean.startsWith("+34")) return 2; // Spain
  if (clean.startsWith("+44")) return 2; // UK
  if (clean.startsWith("+49")) return 2; // Germany
  if (clean.startsWith("+33")) return 2; // France
  if (clean.startsWith("+39")) return 2; // Italy
  if (clean.startsWith("+55")) return 2; // Brazil
  if (clean.startsWith("+54")) return 2; // Argentina
  if (clean.startsWith("+57")) return 2; // Colombia
  
  // Default: 3 coins
  return 3;
}

export async function POST(request: NextRequest) {
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
    
    // Verify user with token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const userId = user.id;

    // Check rate limit
    const rateLimit = checkRateLimit(userId);
    if (!rateLimit.allowed) {
      const secondsRemaining = Math.ceil(rateLimit.resetIn / 1000);
      return NextResponse.json(
        { 
          error: "Rate limit exceeded",
          message: `Has alcanzado el límite de ${RATE_LIMIT_MAX} SMS por minuto. Espera ${secondsRemaining} segundos antes de enviar otro.`,
          retryAfter: secondsRemaining
        },
        { status: 429 }
      );
    }

    // Parse request body
    const { phoneNumber, message } = await request.json();

    if (!phoneNumber || !message) {
      return NextResponse.json(
        { error: "Missing required fields: phoneNumber and message" },
        { status: 400 }
      );
    }

    // Get user profile and check balance
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("credits_balance")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Validate phone number format
    const cleanNumber = phoneNumber.replace(/[^\d+]/g, "");
    if (!cleanNumber.startsWith("+") || cleanNumber.length < 8) {
      return NextResponse.json(
        { error: "Invalid phone number format. Must include country code (e.g., +53 12345678)" },
        { status: 400 }
      );
    }

    // Calculate number of SMS parts (160 chars per SMS)
    const smsParts = Math.ceil(message.length / 160) || 1;
    
    // Calculate coins cost
    const coinsPerSMS = getCoinsCost(phoneNumber);
    const totalCoinsCost = coinsPerSMS * smsParts;

    // Validate message length
    if (message.length === 0) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    if (message.length > 480) {
      return NextResponse.json(
        { error: "Message too long. Maximum 480 characters (3 SMS parts)" },
        { status: 400 }
      );
    }

    // Validate coins balance
    if ((profile.credits_balance || 0) < totalCoinsCost) {
      return NextResponse.json(
        { 
          error: "Insufficient coins",
          required: totalCoinsCost,
          available: profile.credits_balance || 0,
          message: `Necesitas ${totalCoinsCost} coins para enviar este mensaje. Tienes ${profile.credits_balance || 0} coins disponibles.`
        },
        { status: 402 }
      );
    }

    // Call Innoverit API
    const INNOVERIT_API_KEY = process.env.INNOVERIT_API_KEY;
    if (!INNOVERIT_API_KEY) {
      return NextResponse.json(
        { error: "Server configuration error: Missing API key" },
        { status: 500 }
      );
    }

    // Call Innoverit API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    let innoveritResponse: Response;
    try {
      innoveritResponse = await fetch("https://www.innoverit.com/api/v2/sms/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          apikey: INNOVERIT_API_KEY,
          number: phoneNumber,
          content: message,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        return NextResponse.json(
          { error: "Request timeout - API took too long to respond" },
          { status: 504 }
        );
      }
      throw error;
    }

    if (!innoveritResponse.ok) {
      return NextResponse.json(
        { error: `API error: ${innoveritResponse.statusText}` },
        { status: innoveritResponse.status }
      );
    }

    const innoveritData: InnoveritResponse = await innoveritResponse.json();

    if (innoveritData.error_code !== 0) {
      // Record failed attempt in history
      await supabaseAdmin
        .from("sms_history")
        .insert({
          user_id: userId,
          phone_number: phoneNumber,
          message: message,
          country: null,
          operator: null,
          cost: 0,
          status: "failed",
          api_response: innoveritData,
        });

      return NextResponse.json(
        { 
          error: innoveritData.message || "Failed to send SMS",
          innoverit_error: innoveritData 
        },
        { status: 400 }
      );
    }

    // Deduct coins
    const newBalance = (profile.credits_balance || 0) - totalCoinsCost;
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ credits_balance: newBalance })
      .eq("id", userId);

    if (updateError) {
      console.error("Failed to update coins:", updateError);
      return NextResponse.json(
        { error: "Failed to update coins balance" },
        { status: 500 }
      );
    }

    // Record SMS in history
    const { error: historyError } = await supabaseAdmin
      .from("sms_history")
      .insert({
        user_id: userId,
        phone_number: phoneNumber,
        message: message,
        country: innoveritData.iso || null,
        operator: null,
        cost: totalCoinsCost,
        status: "sent",
        delivery_status: innoveritData.delivery_status || "pending",
        api_response: innoveritData,
      });

    if (historyError) {
      console.error("Failed to record SMS history:", historyError);
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "SMS sent successfully",
      destination: innoveritData.destination,
      cost: totalCoinsCost,
      country: innoveritData.iso,
      remaining_coins: newBalance,
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
