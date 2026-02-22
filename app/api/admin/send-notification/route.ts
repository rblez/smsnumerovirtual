import { NextResponse } from "next/server";
import { Resend } from "resend";
import { verifyAdminAccess } from "@/lib/admin-check";

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Verify admin access using centralized function
    const auth = await verifyAdminAccess(request);
    if (!auth.success) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status || 403 }
      );
    }

    const { userId, email, type, amount } = await request.json();

    // Validate request
    if (!email || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Determine email template and subject based on notification type
    let subject: string;

    switch (type) {
      case 'credits_added':
        subject = `¡Se añadieron ${amount} coins a tu cuenta!`;
        break;
      case 'credits_removed':
        subject = `Ajuste de coins en tu cuenta`;
        break;
      case 'banned':
        subject = `Tu cuenta ha sido suspendida`;
        break;
      case 'unbanned':
        subject = `¡Tu cuenta ha sido reactivada!`;
        break;
      default:
        return NextResponse.json(
          { error: "Invalid notification type" },
          { status: 400 }
        );
    }

    // Send email using Resend
    const { data, error: emailError } = await resend.emails.send({
      from: 'SMS Número Virtual <noreply@smsnumerovirtual.com>',
      to: email,
      subject: subject,
      // Template functionality removed - using plain text for now
      html: `<p>Hola ${email.split('@')[0]},</p><p>${amount ? `Monto: ${amount}` : ''}</p><p>User ID: ${userId}</p>`,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notification sent successfully",
      id: data?.id,
    });
  } catch (error) {
    console.error("Send notification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
