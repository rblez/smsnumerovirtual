// Resend Email Templates for SMS Número Virtual
// Copy these templates to resend.com

// Template 1: Credits Added
export const creditsAddedTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Coins Añadidos - SMS Número Virtual</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #2E2E2E; padding: 40px 20px; text-align: center; }
    .header img { width: 60px; height: 60px; margin-bottom: 16px; }
    .header h1 { color: #ffffff; font-size: 24px; font-weight: 600; margin: 0; }
    .content { padding: 40px 30px; }
    .title { color: #2E2E2E; font-size: 20px; font-weight: 600; margin-bottom: 20px; }
    .text { color: #737373; font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
    .highlight { background-color: #10B981; color: white; padding: 24px; border-radius: 12px; text-align: center; margin: 24px 0; }
    .highlight-label { font-size: 14px; opacity: 0.9; margin-bottom: 8px; }
    .highlight-value { font-size: 36px; font-weight: 700; }
    .button { display: inline-block; background-color: #2E2E2E; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 500; margin-top: 16px; }
    .footer { background-color: #FAFAFA; padding: 30px; text-align: center; border-top: 1px solid #E5E5E5; }
    .footer-text { color: #737373; font-size: 14px; margin-bottom: 8px; }
    .footer-link { color: #2E2E2E; text-decoration: none; font-weight: 500; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://smsnumerovirtual.com/isotipo.png" alt="SMS Número Virtual">
      <h1>SMS Número Virtual</h1>
    </div>
    <div class="content">
      <div class="title">¡Coins Añadidos!</div>
      <div class="text">Hola {{user_name}},</div>
      <div class="text">Se han añadido coins a tu cuenta. Ahora tienes más saldo disponible para enviar SMS internacionales.</div>
      <div class="highlight">
        <div class="highlight-label">Coins Añadidos</div>
        <div class="highlight-value">+{{amount}}</div>
      </div>
      <div class="text">Tu nuevo balance te permite enviar SMS a más de 200 países. Gracias por confiar en nosotros.</div>
      <a href="https://smsnumerovirtual.com" class="button">Ir a mi cuenta</a>
    </div>
    <div class="footer">
      <div class="footer-text">¿Necesitas ayuda? Contáctanos en <a href="https://t.me/smsnumerovirtual" class="footer-link">Telegram</a></div>
      <div class="footer-text">© 2026 SMS Número Virtual. Todos los derechos reservados.</div>
    </div>
  </div>
</body>
</html>
`;

// Template 2: Credits Removed
export const creditsRemovedTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ajuste de Coins - SMS Número Virtual</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #2E2E2E; padding: 40px 20px; text-align: center; }
    .header img { width: 60px; height: 60px; margin-bottom: 16px; }
    .header h1 { color: #ffffff; font-size: 24px; font-weight: 600; margin: 0; }
    .content { padding: 40px 30px; }
    .title { color: #2E2E2E; font-size: 20px; font-weight: 600; margin-bottom: 20px; }
    .text { color: #737373; font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
    .highlight { background-color: #EF4444; color: white; padding: 24px; border-radius: 12px; text-align: center; margin: 24px 0; }
    .highlight-label { font-size: 14px; opacity: 0.9; margin-bottom: 8px; }
    .highlight-value { font-size: 36px; font-weight: 700; }
    .button { display: inline-block; background-color: #2E2E2E; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 500; margin-top: 16px; }
    .footer { background-color: #FAFAFA; padding: 30px; text-align: center; border-top: 1px solid #E5E5E5; }
    .footer-text { color: #737373; font-size: 14px; margin-bottom: 8px; }
    .footer-link { color: #2E2E2E; text-decoration: none; font-weight: 500; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://smsnumerovirtual.com/isotipo.png" alt="SMS Número Virtual">
      <h1>SMS Número Virtual</h1>
    </div>
    <div class="content">
      <div class="title">Ajuste de Coins</div>
      <div class="text">Hola {{user_name}},</div>
      <div class="text">Se ha realizado un ajuste en tu balance de coins.</div>
      <div class="highlight">
        <div class="highlight-label">Coins Ajustados</div>
        <div class="highlight-value">-{{amount}}</div>
      </div>
      <div class="text">Si tienes alguna pregunta sobre este ajuste, por favor contáctanos.</div>
      <a href="https://smsnumerovirtual.com" class="button">Ir a mi cuenta</a>
    </div>
    <div class="footer">
      <div class="footer-text">¿Necesitas ayuda? Contáctanos en <a href="https://t.me/smsnumerovirtual" class="footer-link">Telegram</a></div>
      <div class="footer-text">© 2026 SMS Número Virtual. Todos los derechos reservados.</div>
    </div>
  </div>
</body>
</html>
`;

// Template 3: Account Banned
export const accountBannedTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cuenta Suspendida - SMS Número Virtual</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #2E2E2E; padding: 40px 20px; text-align: center; }
    .header img { width: 60px; height: 60px; margin-bottom: 16px; }
    .header h1 { color: #ffffff; font-size: 24px; font-weight: 600; margin: 0; }
    .content { padding: 40px 30px; }
    .title { color: #DC2626; font-size: 20px; font-weight: 600; margin-bottom: 20px; }
    .text { color: #737373; font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
    .alert { background-color: #FEF2F2; border: 1px solid #FECACA; color: #DC2626; padding: 20px; border-radius: 12px; margin: 24px 0; }
    .alert-title { font-weight: 600; margin-bottom: 8px; }
    .button { display: inline-block; background-color: #2E2E2E; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 500; margin-top: 16px; }
    .footer { background-color: #FAFAFA; padding: 30px; text-align: center; border-top: 1px solid #E5E5E5; }
    .footer-text { color: #737373; font-size: 14px; margin-bottom: 8px; }
    .footer-link { color: #2E2E2E; text-decoration: none; font-weight: 500; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://smsnumerovirtual.com/isotipo.png" alt="SMS Número Virtual">
      <h1>SMS Número Virtual</h1>
    </div>
    <div class="content">
      <div class="title">Cuenta Suspendida</div>
      <div class="text">Hola {{user_name}},</div>
      <div class="alert">
        <div class="alert-title">Tu cuenta ha sido suspendida</div>
        <div>No podrás acceder a la plataforma ni enviar SMS en este momento.</div>
      </div>
      <div class="text">Si crees que esto es un error o deseas más información sobre esta suspensión, por favor contáctanos directamente.</div>
      <a href="https://t.me/smsnumerovirtual" class="button">Contactar Soporte</a>
    </div>
    <div class="footer">
      <div class="footer-text">Soporte: <a href="https://t.me/smsnumerovirtual" class="footer-link">@smsnumerovirtual</a></div>
      <div class="footer-text">© 2026 SMS Número Virtual. Todos los derechos reservados.</div>
    </div>
  </div>
</body>
</html>
`;

// Template 4: Account Unbanned
export const accountUnbannedTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cuenta Reactivada - SMS Número Virtual</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #2E2E2E; padding: 40px 20px; text-align: center; }
    .header img { width: 60px; height: 60px; margin-bottom: 16px; }
    .header h1 { color: #ffffff; font-size: 24px; font-weight: 600; margin: 0; }
    .content { padding: 40px 30px; }
    .title { color: #059669; font-size: 20px; font-weight: 600; margin-bottom: 20px; }
    .text { color: #737373; font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
    .success { background-color: #ECFDF5; border: 1px solid #A7F3D0; color: #059669; padding: 20px; border-radius: 12px; margin: 24px 0; }
    .success-title { font-weight: 600; margin-bottom: 8px; }
    .button { display: inline-block; background-color: #2E2E2E; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 500; margin-top: 16px; }
    .footer { background-color: #FAFAFA; padding: 30px; text-align: center; border-top: 1px solid #E5E5E5; }
    .footer-text { color: #737373; font-size: 14px; margin-bottom: 8px; }
    .footer-link { color: #2E2E2E; text-decoration: none; font-weight: 500; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://smsnumerovirtual.com/isotipo.png" alt="SMS Número Virtual">
      <h1>SMS Número Virtual</h1>
    </div>
    <div class="content">
      <div class="title">¡Cuenta Reactivada!</div>
      <div class="text">Hola {{user_name}},</div>
      <div class="success">
        <div class="success-title">Tu cuenta ha sido reactivada</div>
        <div>Ya puedes acceder a la plataforma y enviar SMS sin restricciones.</div>
      </div>
      <div class="text">Gracias por tu paciencia. Tu cuenta está nuevamente activa y lista para usar.</div>
      <a href="https://smsnumerovirtual.com" class="button">Ir a mi cuenta</a>
    </div>
    <div class="footer">
      <div class="footer-text">¿Necesitas ayuda? Contáctanos en <a href="https://t.me/smsnumerovirtual" class="footer-link">Telegram</a></div>
      <div class="footer-text">© 2026 SMS Número Virtual. Todos los derechos reservados.</div>
    </div>
  </div>
</body>
</html>
`;

// Instructions for Resend.com:
// 1. Go to https://resend.com
// 2. Navigate to Templates
// 3. Create 4 new templates with the following names:
//    - credits-added
//    - credits-removed
//    - account-banned
//    - account-unbanned
// 4. Copy the HTML above into each template
// 5. Variables available: {{user_name}}, {{amount}}
