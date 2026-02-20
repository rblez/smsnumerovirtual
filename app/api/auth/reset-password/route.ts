import { NextRequest, NextResponse } from 'next/server';
import { sendPasswordResetEmail } from '@/lib/email';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Verificar que el email existe en auth.users
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    const user = authUser?.users?.find(u => u.email === email);
    
    if (authError || !user) {
      // Por seguridad, no revelar si el email existe o no
      return NextResponse.json(
        { message: 'Si el email existe, recibirás un correo con instrucciones' },
        { status: 200 }
      );
    }

    // Obtener nombre del perfil si existe
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    // Generar token de recuperación
    const { data: userData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
    });

    if (linkError || !userData.properties?.action_link) {
      throw new Error('Error al generar enlace de recuperación');
    }

    // Extraer token de la URL
    const actionLink = userData.properties.action_link;
    const tokenMatch = actionLink.match(/token=([^&]+)/);
    const hashedToken = tokenMatch ? tokenMatch[1] : '';

    // Construir URL de recuperación
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${hashedToken}`;

    // Enviar email
    await sendPasswordResetEmail(
      email,
      profile?.full_name || 'Usuario',
      resetUrl
    );

    return NextResponse.json(
      { message: 'Si el email existe, recibirás un correo con instrucciones' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending reset email:', error);
    return NextResponse.json(
      { error: 'Error al enviar el correo' },
      { status: 500 }
    );
  }
}
