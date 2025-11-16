// Setup type definitions for built-in Supabase Runtime APIs
import 'funcs';
import { createClient } from 'supabase';
import { corsHeaders } from '../_shared/cors.ts';
import { EmailData, sendAdminNotification, sendConfirmationEmail } from '../_shared/email.ts';

type SignupPayload = {
  first_name: string;
  last_name: string;
  company: string;
  email: string;
  phone: string;
};

type ProcessSignupRequest = {
  action: 'signup';
  recaptchaToken: string;
  payload: SignupPayload;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function verifyRecaptcha(token: string): Promise<{
  ok: boolean;
  score?: number;
  action?: string;
}> {
  const secret = Deno.env.get('RECAPTCHA_SECRET');
  if (!secret) return { ok: false };
  const body = new URLSearchParams({
    secret,
    response: token,
  });

  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const data = await res.json();
  const success = Boolean(data?.success);
  const score = Number(data?.score ?? 0);
  const action = String(data?.action ?? '');
  if (!success) return { ok: false, score, action };
  if (action !== 'signup') return { ok: false, score, action };
  if (score < 0.7) return { ok: false, score, action };
  return { ok: true, score, action };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response('Not found', { status: 404 });
  }
  try {
    const { action, recaptchaToken, payload } = (await req.json()) as ProcessSignupRequest;
    if (action !== 'signup' || !recaptchaToken || !payload) {
      return new Response(JSON.stringify({ status: 'server_error', message: 'Bad request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // 1) Verify reCAPTCHA
    const recaptcha = await verifyRecaptcha(recaptchaToken);

    if (!recaptcha.ok) {
      return new Response(JSON.stringify({ status: 'recaptcha_failed' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // 2) Supabase client (service role for server-side function)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const normalizedEmail = normalizeEmail(payload.email);

    // 3) Check duplicate
    const { data: existing, error: findError } = await supabase
      .from('signups')
      .select('id, email')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (findError) {
      console.error('Lookup error:', findError);
      return new Response(
        JSON.stringify({
          status: 'server_error',
          message: 'Please try again later.',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    const emailData: EmailData = {
      firstName: payload.first_name,
      lastName: payload.last_name,
      company: payload.company,
      phone: payload.phone,
      email: normalizedEmail,
    };
    const adminTo = Deno.env.get('MAIL_ADMIN_TO') ?? 'info@hyper-m.online';

    if (existing) {
      // Duplicate: notify admin only
      try {
        await sendAdminNotification({ ...emailData }, adminTo, true);
      } catch (e) {
        console.error('Admin email (duplicate) failed:', e);
      }
      return new Response(JSON.stringify({ status: 'already_registered' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // 4) Insert new signup
    const { error: insertError } = await supabase.from('signups').insert({
      first_name: payload.first_name,
      last_name: payload.last_name,
      company: payload.company,
      email: normalizedEmail,
      phone: payload.phone,
    });
    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(
        JSON.stringify({
          status: 'server_error',
          message: 'Please try again later.',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // 5) Send emails (best-effort, don't fail the whole flow if an email fails)
    try {
      await Promise.allSettled([
        sendConfirmationEmail({ ...emailData }, normalizedEmail),
        sendAdminNotification({ ...emailData }, adminTo, false),
      ]);
    } catch (e) {
      console.error('Email sending failed:', e);
    }

    return new Response(JSON.stringify({ status: 'success' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (err: unknown) {
    console.error(err);
    return new Response(
      JSON.stringify({
        status: 'server_error',
        message: 'Please try again later.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
