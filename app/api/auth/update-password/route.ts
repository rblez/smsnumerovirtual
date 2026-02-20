import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token y contraseña son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Verificar el token primero
    const { data: verifyData, error: verifyError } = await supabaseAdmin.auth.verifyOtp({
      type: 'recovery',
      token_hash: token,
    });

    if (verifyError || !verifyData.user) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 400 }
      );
    }

    // Actualizar la contraseña del usuario
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      verifyData.user.id,
      { password: password }
    );

    if (updateError) {
      return NextResponse.json(
        { error: 'Error al actualizar contraseña' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Contraseña actualizada exitosamente' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { error: 'Error al actualizar contraseña' },
      { status: 500 }
    );
  }
}
