//@ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req: { method: string; json: () => any }) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }
//@ts-ignore
  try {
    //@ts-ignore
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
    
    console.log("Function invoked")
    
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set")
      return new Response(
        JSON.stringify({ success: false, error: "RESEND_API_KEY not configured" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      )
    }

    const requestBody = await req.json()
    console.log("Request body:", JSON.stringify(requestBody))

    const { to, subject, body, type } = requestBody

    if (!to || !subject || !body) {
      console.error("Missing required fields")
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required fields: to, subject, body" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      )
    }

    const htmlBody = generateEmailHTML(body, type || 'booking', subject)

    console.log("Sending email to Resend API...")

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "BodyForge <onboarding@resend.dev>",
        to: [to],
        subject: subject,
        html: htmlBody,
      }),
    })

    const responseText = await resendResponse.text()
    console.log("Resend API response:", responseText)

    if (!resendResponse.ok) {
      console.error(`Resend API error: ${responseText}`)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Resend API error: ${responseText}` 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      )
    }

    const data = JSON.parse(responseText)

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    )
  } catch (error) {
    console.error("Function error:", error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        //@ts-ignore
        error: error.message || "Unknown error occurred" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    )
  }
})

function generateEmailHTML(body: string, type: string, subject: string): string {
  const formattedBody = body.replace(/\n/g, '<br>')
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #000000; font-family: Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border: 2px solid #ef4444; border-radius: 12px; overflow: hidden;">
              <tr>
                <td style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
                    <span style="color: #ffffff;">BODY</span><span style="color: #fecaca;">FORGE</span>
                  </h1>
                  <p style="color: #fecaca; margin: 10px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                    ${getTypeLabel(type)}
                  </p>
                </td>
              </tr>
              
              <tr>
                <td style="padding: 40px 30px; color: #ffffff;">
                  <div style="line-height: 1.8; font-size: 16px; color: #d1d5db;">
                    ${formattedBody}
                  </div>
                </td>
              </tr>
              
              <tr>
                <td style="background-color: #0a0a0a; padding: 30px; text-align: center; border-top: 1px solid #374151;">
                  <p style="color: #9ca3af; margin: 0 0 10px 0; font-size: 14px;">
                    This is an automated message from BodyForge
                  </p>
                  <p style="color: #6b7280; margin: 0; font-size: 12px;">
                    © ${new Date().getFullYear()} BodyForge. All rights reserved.
                  </p>
                  <div style="margin-top: 20px;">
                    <a href="mailto:support@bodyforge.com" style="color: #ef4444; text-decoration: none; font-weight: bold; font-size: 14px;">
                      Contact Support
                    </a>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

function getTypeLabel(type: string): string {
  switch (type) {
    case 'booking':
      return 'Booking Confirmation'
    case 'inquiry':
      return 'Inquiry Response'
    case 'membership':
      return 'Membership Update'
    default:
      return 'Notification'
  }
}