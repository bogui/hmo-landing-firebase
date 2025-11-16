// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
// Setup type definitions for built-in Supabase Runtime APIs
import FormData from "formdata";
import "funcs";
import Mailgun from "mailgun";
import { corsHeaders } from "../_shared/cors.ts";

type EmailData = {
  firstName: string;
  lastName: string;
  company: string;
  phone: string;
  email: string;
};

const mlgn = new Mailgun(FormData);
const mg = mlgn.client({
  username: "api",
  key: Deno.env.get("MAILGUN_API_KEY") ?? "api-key",
  url: Deno.env.get("MAILGUN_API_URL") ?? "api-url",
});
const getNotificationTextTemplate = (data: EmailData) => {
  return `Нова заявка за ексклузивен достъп

Име: ${data.firstName}
Фамилия: ${data.lastName}
Име на компанията: ${data.company}
Email: ${data.email}
Телефон: ${data.phone}

Заявката е получена на: ${new Date().toLocaleString("bg-BG")}

Hyper-M - Система за управление на бизнес процеси`;
};
const getNotificationHtmlTemplate = (data: EmailData) => {
  return `
      <!DOCTYPE html>
      <html lang="bg">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Нова заявка за ексклузивен достъп</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background-color: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #3b82f6;
          }
          .header h1 {
            color: #3b82f6;
            margin: 0;
            font-size: 24px;
          }
          .field {
            margin-bottom: 15px;
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
          }
          .field-label {
            font-weight: bold;
            color: #374151;
            margin-bottom: 5px;
          }
          .field-value {
            color: #6b7280;
            font-size: 16px;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
          }
          .highlight {
            background-color: #fef3c7;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #f59e0b;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Нова заявка за ексклузивен достъп</h1>
          </div>

          <div class="highlight">
            <strong>Нов кандидат се е регистрирал за ексклузивен достъп до Hyper-M!</strong>
          </div>

          <div class="field">
            <div class="field-label">👤 Име:</div>
            <div class="field-value">${data.firstName}</div>
          </div>

          <div class="field">
            <div class="field-label">👤 Фамилия:</div>
            <div class="field-value">${data.lastName}</div>
          </div>

          <div class="field">
            <div class="field-label">🏢 Име на компанията:</div>
            <div class="field-value">${data.company}</div>
          </div>

          <div class="field">
            <div class="field-label">📧 Email:</div>
            <div class="field-value"><a href="mailto:${data.email}" style="color: #3b82f6;">${data.email}</a></div>
          </div>

          <div class="field">
            <div class="field-label">📞 Телефон:</div>
            <div class="field-value"><a href="tel:${data.phone}" style="color: #3b82f6;">${data.phone}</a></div>
          </div>

          <div class="footer">
            <p>Заявката е получена на: ${new Date().toLocaleString("bg-BG")}</p>
            <p>Hyper-M - Система за управление на бизнес процеси</p>
          </div>
        </div>
      </body>
      </html>
    `;
};
const getConfirmationHtmlTemplate = (data: EmailData) => {
  return `
      <!DOCTYPE html>
      <html lang="bg">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Потвърждение за регистрация - Hyper-M</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            background-color: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #3b82f6;
          }
          .header h1 {
            color: #3b82f6;
            margin: 0;
            font-size: 28px;
          }
          .success-icon {
            font-size: 48px;
            margin-bottom: 15px;
          }
          .content {
            margin-bottom: 30px;
          }
          .highlight {
            background-color: #ecfdf5;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #10b981;
            margin: 20px 0;
          }
          .next-steps {
            background-color: #fef3c7;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #f59e0b;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
          }
          .contact-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">✅</div>
            <h1>Регистрацията ви е потвърдена!</h1>
          </div>

          <div class="content">
            <p>Здравейте <strong>${data.firstName} ${data.lastName}</strong>,</p>

            <p>Благодарим ви за интереса към <strong>Hyper-M</strong>! Вашата заявка за ексклузивен достъп беше получена успешно.</p>

            <div class="highlight">
              <h3>🎯 Какво се случва следва?</h3>
              <ul>
                <li>Нашият екип ще прегледа вашата заявка в рамките на 24 часа</li>
                <li>Ще се свържем с вас на посочения телефон или имейл</li>
                <li>Ще ви предоставим детайлна информация за вашия ексклузивен достъп</li>
              </ul>
            </div>

            <div class="next-steps">
              <h3>📋 Информация за вашата заявка:</h3>
              <p><strong>Компания:</strong> ${data.company}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Телефон:</strong> ${data.phone}</p>
              <p><strong>Дата на регистрация:</strong> ${
    new Date().toLocaleString("bg-BG")
  }</p>
            </div>

            <div class="contact-info">
              <h3>📞 Имате въпроси?</h3>
              <p>Ако имате въпроси или нужда от допълнителна информация, не се колебайте да се свържете с нас:</p>
              <p><strong>Email:</strong> info@hyper-m.online</p>
              <p><strong>Телефон:</strong> +359 882 25 05 95</p>
            </div>
          </div>

          <div class="footer">
            <p><strong>Hyper-M</strong> - Система за управление на бизнес процеси</p>
            <p>Този имейл е изпратен автоматично. Моля, не отговаряйте на него.</p>
          </div>
        </div>
      </body>
      </html>
    `;
};
const getConfirmationTextTemplate = (data: EmailData) => {
  return `Регистрацията ви е потвърдена!

Здравейте ${data.firstName} ${data.lastName},

Благодарим ви за интереса към Hyper-M! Вашата заявка за ексклузивен достъп беше получена успешно.

КАКВО СЕ СЛУЧВА СЛЕДВА?
- Нашият екип ще прегледа вашата заявка в рамките на 24 часа
- Ще се свържем с вас на посочения телефон или имейл
- Ще ви предоставим детайлна информация за вашия ексклузивен достъп

ИНФОРМАЦИЯ ЗА ВАШАТА ЗАЯВКА:
Компания: ${data.company}
Email: ${data.email}
Телефон: ${data.phone}
Дата на регистрация: ${new Date().toLocaleString("bg-BG")}

ИМАТЕ ВЪПРОСИ?
Ако имате въпроси или нужда от допълнителна информация, не се колебайте да се свържете с нас:
Email: info@hyper-m.online
Телефон: +359 882 25 05 95

Hyper-M - Система за управление на бизнес процеси
Този имейл е изпратен автоматично. Моля, не отговаряйте на него.`;
};

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }
  try {
    const { data, to, type, subject } = await req.json();
    const htmlContent = type === "notification"
      ? getNotificationHtmlTemplate(data)
      : getConfirmationHtmlTemplate(data);
    const textContent = type === "notification"
      ? getNotificationTextTemplate(data)
      : getConfirmationTextTemplate(data);
    const messageData = {
      from: "Hyper-M <info@hyper-m.online>",
      to: [
        to,
      ],
      subject: subject,
      text: textContent,
      html: htmlContent,
    };
    const res = await mg.messages.create(
      Deno.env.get("MAILGUN_DOMAIN") ?? "domain",
      messageData,
    );

    return new Response(JSON.stringify(res), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error
      ? err.message
      : typeof err === "string"
      ? err
      : JSON.stringify(err);
    return new Response(message, {
      status: 500,
    });
  }
}); /* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-marketing-email' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
