import { Resend } from 'resend';
import { readFileSync } from 'fs';
import { join } from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'SMS Número Virtual <noreply@smsnumerovirtual.com>';

/**
 * Read email template from file and replace variables
 */
function loadTemplate(templateName: string, variables: Record<string, string>): string {
  const templatePath = join(process.cwd(), 'emails', `${templateName}.html`);
  let template = readFileSync(templatePath, 'utf-8');
  
  // Replace all variables {{variableName}} with values
  Object.entries(variables).forEach(([key, value]) => {
    template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  
  return template;
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetUrl: string
) {
  const html = loadTemplate('password-reset', {
    name,
    resetUrl,
  });

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Recuperar tu contraseña - SMS Número Virtual',
    html,
  });
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(
  to: string,
  name: string,
  customId: string,
  dashboardUrl: string
) {
  const html = loadTemplate('welcome', {
    name,
    customId,
    dashboardUrl,
  });

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: '¡Bienvenido a SMS Número Virtual!',
    html,
  });
}

/**
 * Send coins added notification
 */
export async function sendCoinsAddedEmail(
  to: string,
  name: string,
  coinsAmount: string,
  packageName: string,
  paymentMethod: string,
  purchaseDate: string,
  transactionId: string,
  previousBalance: string,
  newBalance: string,
  dashboardUrl: string
) {
  const html = loadTemplate('coins-added', {
    name,
    coinsAmount,
    packageName,
    paymentMethod,
    purchaseDate,
    transactionId,
    previousBalance,
    newBalance,
    dashboardUrl,
  });

  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `¡${coinsAmount} coins agregados a tu cuenta!`,
    html,
  });
}
