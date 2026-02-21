import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '../../../../lib/email';

export async function POST(req: Request) {
  try {
    const { to, name, customId, dashboardUrl } = await req.json();

    // Basic validation
    if (!to || !name || !customId || !dashboardUrl) {
      return NextResponse.json(
        { message: 'Missing required fields: to, name, customId, dashboardUrl' },
        { status: 400 }
      );
    }

    await sendWelcomeEmail(to, name, customId, dashboardUrl);

    return NextResponse.json({ message: 'Welcome email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return NextResponse.json({ message: 'Failed to send welcome email' }, { status: 500 });
  }
}
