//@ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
 // @ts-ignore
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
     // @ts-ignore
    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
    if (!BREVO_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "BREVO_API_KEY not configured" }),
        { headers: corsHeaders, status: 500 }
      );
    }

    const { to, subject, body, type } = await req.json();

    if (!to || !subject || !body) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing fields: to, subject, body" }),
        { headers: corsHeaders, status: 400 }
      );
    }

    const htmlContent = generateEmailHTML(body, type || "booking", subject);

    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "BodyForge", email: "rastakadema@gmail.com" },
        to: [{ email: to }],
        subject,
        htmlContent,
      }),
    });

    if (!brevoResponse.ok) {
      const errorText = await brevoResponse.text();
      console.error("Brevo API error:", errorText);
      return new Response(
        JSON.stringify({ success: false, error: `Brevo API error: ${errorText}` }),
        { headers: corsHeaders, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { headers: corsHeaders, status: 200 }
    );

  } catch (err) {
    console.error("Function error:", err);
    return new Response(
      // @ts-ignore
      JSON.stringify({ success: false, error: err.message }),
      { headers: corsHeaders, status: 500 }
    );
  }
});

// ----------------------
// HTML email template
// ----------------------
function generateEmailHTML(body: string, type: string, subject: string): string {
  const formattedBody = body.replace(/\n/g, "<br>");
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin:0;padding:0;background-color:#000;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#000;">
        <tr>
          <td align="center" style="padding:40px 20px;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;border:2px solid #ef4444;border-radius:12px;overflow:hidden;">
              <tr>
                <td style="background:linear-gradient(135deg,#ef4444 0%,#dc2626 100%);padding:30px;text-align:center;">
                  <h1 style="color:#fff;margin:0;font-size:32px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;">
                    <span style="color:#fff;">BODY</span><span style="color:#fecaca;">FORGE</span>
                  </h1>
                  <p style="color:#fecaca;margin:10px 0 0 0;font-size:14px;text-transform:uppercase;letter-spacing:1px;">
                    ${getTypeLabel(type)}
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:40px 30px;color:#fff;">
                  <div style="line-height:1.8;font-size:16px;color:#d1d5db;">
                    ${formattedBody}
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background-color:#0a0a0a;padding:30px;text-align:center;border-top:1px solid #374151;">
                  <p style="color:#9ca3af;margin:0 0 10px 0;font-size:14px;">This is an automated message from BodyForge</p>
                  <p style="color:#6b7280;margin:0;font-size:12px;">© ${new Date().getFullYear()} BodyForge. All rights reserved.</p>
                  <div style="margin-top:20px;">
                    <a href="mailto:support@bodyforge.com" style="color:#ef4444;text-decoration:none;font-weight:bold;font-size:14px;">Contact Support</a>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

function getTypeLabel(type: string): string {
  switch (type) {
    case "booking": return "Booking Confirmation";
    case "inquiry": return "Inquiry Response";
    case "membership": return "Membership Update";
    default: return "Notification";
  }
}
