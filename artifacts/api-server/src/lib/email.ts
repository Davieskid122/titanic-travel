import { Resend } from "resend";
import { logger } from "./logger";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL ?? "onboarding@resend.dev";
const SITE_URL = process.env.SITE_URL ?? "https://titanictravel.app";

interface Passenger {
  title: string;
  firstName: string;
  lastName: string;
  type: string;
}

interface Flight {
  flightNumber: string;
  origin: string;
  originCode: string;
  destination: string;
  destinationCode: string;
  departDate: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  aircraft: string;
}

interface BookingEmailData {
  toEmail: string;
  toName: string;
  reference: string;
  cabinClass: string;
  totalPrice: number;
  flight: Flight;
  passengers: Passenger[];
}

function cabinLabel(cabin: string) {
  if (cabin === "upper") return "Upper Class";
  if (cabin === "premium") return "Premium Economy";
  return "Economy";
}

function buildHtml(data: BookingEmailData): string {
  const { reference, flight, passengers, cabinClass, totalPrice, toName } = data;

  const passengerRows = passengers
    .map(
      (p) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;color:#333;font-size:14px;">
          ${p.title} ${p.firstName} ${p.lastName}
        </td>
        <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;color:#666;font-size:14px;text-align:right;text-transform:capitalize;">
          ${p.type}
        </td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Booking Confirmation</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#A70D2E;border-radius:12px 12px 0 0;padding:28px 32px;text-align:center;">
              <p style="margin:0 0 4px 0;font-size:22px;font-weight:900;letter-spacing:2px;color:#fff;">⚓ TITANIC TRAVEL</p>
              <p style="margin:0;font-size:12px;letter-spacing:4px;color:rgba(255,255,255,0.7);text-transform:uppercase;">Booking Confirmation</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="background:#fff;padding:32px 32px 24px;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#030C16;">Your booking is confirmed! ✈️</p>
              <p style="margin:0;font-size:15px;color:#555;line-height:1.6;">
                Hi ${toName}, thank you for booking with Titanic Travel. Your seat is reserved and we look forward to flying with you.
              </p>
            </td>
          </tr>

          <!-- Reference Banner -->
          <tr>
            <td style="background:#fff;padding:0 32px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#f9f0ff;border:2px dashed #5B056A;border-radius:10px;padding:18px 24px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:12px;color:#5B056A;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Booking Reference</p>
                    <p style="margin:0;font-size:32px;font-weight:900;color:#5B056A;letter-spacing:4px;">${reference}</p>
                    <p style="margin:6px 0 0;font-size:12px;color:#888;">Keep this safe — you'll need it to manage your booking</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Flight Details -->
          <tr>
            <td style="background:#fff;padding:0 32px 28px;">
              <p style="margin:0 0 16px;font-size:13px;font-weight:700;color:#030C16;text-transform:uppercase;letter-spacing:1px;">Flight Details</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;border-radius:10px;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="text-align:center;width:35%;">
                          <p style="margin:0;font-size:30px;font-weight:900;color:#030C16;">${flight.departTime}</p>
                          <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#A70D2E;">${flight.originCode}</p>
                          <p style="margin:2px 0 0;font-size:12px;color:#888;">${flight.origin}</p>
                        </td>
                        <td style="text-align:center;width:30%;">
                          <p style="margin:0 0 4px;font-size:11px;color:#999;">${flight.duration}</p>
                          <div style="height:2px;background:linear-gradient(to right,#A70D2E,#5B056A);border-radius:2px;"></div>
                          <p style="margin:4px 0 0;font-size:11px;color:#999;">Direct</p>
                        </td>
                        <td style="text-align:center;width:35%;">
                          <p style="margin:0;font-size:30px;font-weight:900;color:#030C16;">${flight.arriveTime}</p>
                          <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#A70D2E;">${flight.destinationCode}</p>
                          <p style="margin:2px 0 0;font-size:12px;color:#888;">${flight.destination}</p>
                        </td>
                      </tr>
                    </table>
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;padding-top:16px;border-top:1px solid #eee;">
                      <tr>
                        <td style="font-size:13px;color:#555;"><strong style="color:#030C16;">Date:</strong> ${flight.departDate}</td>
                        <td style="font-size:13px;color:#555;text-align:center;"><strong style="color:#030C16;">Flight:</strong> ${flight.flightNumber}</td>
                        <td style="font-size:13px;color:#555;text-align:right;"><strong style="color:#030C16;">Cabin:</strong> ${cabinLabel(cabinClass)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Passengers -->
          <tr>
            <td style="background:#fff;padding:0 32px 28px;">
              <p style="margin:0 0 16px;font-size:13px;font-weight:700;color:#030C16;text-transform:uppercase;letter-spacing:1px;">Passengers</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:10px;overflow:hidden;">
                <thead>
                  <tr style="background:#f8f8f8;">
                    <th style="padding:10px 12px;text-align:left;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Name</th>
                    <th style="padding:10px 12px;text-align:right;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Type</th>
                  </tr>
                </thead>
                <tbody>${passengerRows}</tbody>
              </table>
            </td>
          </tr>

          <!-- Total Price -->
          <tr>
            <td style="background:#fff;padding:0 32px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#030C16;border-radius:10px;padding:20px 24px;">
                <tr>
                  <td style="color:#fff;font-size:15px;font-weight:600;">Total paid</td>
                  <td style="text-align:right;color:#fff;font-size:26px;font-weight:900;">£${totalPrice.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="background:#fff;padding:0 32px 40px;text-align:center;">
              <a href="${SITE_URL}/booking/${reference}"
                 style="display:inline-block;background:#A70D2E;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 36px;border-radius:50px;">
                View my booking
              </a>
              <p style="margin:16px 0 0;font-size:13px;color:#999;">
                Or manage your booking at <a href="${SITE_URL}/manage" style="color:#A70D2E;text-decoration:none;">${SITE_URL}/manage</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f4f4f5;border-radius:0 0 12px 12px;padding:24px 32px;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:#999;">© ${new Date().getFullYear()} Titanic Travel Airways Ltd. All rights reserved.</p>
              <p style="margin:0;font-size:12px;color:#bbb;">This is an automated confirmation. Please do not reply to this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendBookingConfirmation(data: BookingEmailData): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    logger.warn("RESEND_API_KEY not set — skipping confirmation email");
    return;
  }

  try {
    const { data: result, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.toEmail,
      subject: `Booking confirmed — ${data.flight.originCode} → ${data.flight.destinationCode} · Ref: ${data.reference}`,
      html: buildHtml(data),
    });

    if (error) {
      logger.error({ error }, "Resend email failed");
    } else {
      logger.info({ emailId: result?.id, reference: data.reference }, "Booking confirmation email sent");
    }
  } catch (err) {
    logger.error({ err }, "Error sending booking confirmation email");
  }
}
