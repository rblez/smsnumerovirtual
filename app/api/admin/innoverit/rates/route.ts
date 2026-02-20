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

    // Get rates from database (sms_rates table)
    const { data: ratesData, error: ratesError } = await supabaseAdmin
      .from("sms_rates")
      .select("country, country_code, sale_price, operator")
      .order("country", { ascending: true });

    if (ratesError) {
      console.error("Error fetching rates:", ratesError);
      return NextResponse.json(
        { error: "Failed to fetch rates" },
        { status: 500 }
      );
    }

    // Group by country and get min price
    const countryMap = new Map();
    ratesData?.forEach((rate) => {
      const existing = countryMap.get(rate.country);
      if (!existing || rate.sale_price < existing.sale_price) {
        countryMap.set(rate.country, {
          country: rate.country,
          country_code: rate.country_code,
          min_price: rate.sale_price,
          operators: 1,
        });
      } else {
        existing.operators++;
      }
    });

    const countries = Array.from(countryMap.values());

    // Calculate statistics
    const stats = {
      totalCountries: countries.length,
      totalOperators: ratesData?.length || 0,
      avgPrice: countries.reduce((sum, c) => sum + c.min_price, 0) / (countries.length || 1),
      minPrice: Math.min(...countries.map(c => c.min_price)),
      maxPrice: Math.max(...countries.map(c => c.min_price)),
    };

    return NextResponse.json({
      countries,
      stats,
      totalRecords: ratesData?.length || 0,
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
