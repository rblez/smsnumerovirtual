import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Create untyped admin client for this route
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Generate a random custom ID (8-10 chars, alphanumeric)
function generateCustomId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const nums = '0123456789';
  let result = '';
  // Generate 8-10 random characters
  const length = 8 + Math.floor(Math.random() * 3);
  for (let i = 0; i < length; i++) {
    const useNum = Math.random() > 0.6;
    result += useNum 
      ? nums.charAt(Math.floor(Math.random() * nums.length))
      : chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
    
    // Generate custom ID
    const customId = generateCustomId();

    // Create user with auto-confirm enabled
    const { data: userData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: fullName,
        custom_id: customId,
      },
    });

    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!userData.user) {
      return NextResponse.json(
        { error: "Error al crear usuario" },
        { status: 500 }
      );
    }

    // Create profile for the new user with custom ID
    const isAdmin = email === 'pedroenriquebar@gmail.com' || email === 'rblez@proton.me';
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: userData.user.id,
        custom_id: customId,
        full_name: fullName || null,
        credits_balance: 0,
        role: isAdmin ? 'admin' : 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error("Error creating profile:", profileError);
    }

    return NextResponse.json({
      success: true,
      message: "Cuenta creada exitosamente",
      user: {
        id: customId,
        email: userData.user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
