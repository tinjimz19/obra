import { NextResponse } from "next/server";

/**
 * Endpoint de ejemplo para el formulario de cotización.
 *
 * Hoy sólo valida y deja traza en el log del servidor. Para producción,
 * sustituye el bloque marcado por tu integración real (Resend, SendGrid,
 * HubSpot, un webhook a tu CRM…) y añade protección anti-spam
 * (hCaptcha/Turnstile o un honeypot).
 */

type Payload = {
  nombre?: string;
  telefono?: string;
  tipo?: string;
};

export async function POST(request: Request) {
  let body: Payload;

  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "JSON no válido" }, { status: 400 });
  }

  const nombre = body.nombre?.trim() ?? "";
  const telefono = body.telefono?.trim() ?? "";
  const tipo = body.tipo?.trim() ?? "";

  const errores: string[] = [];
  if (nombre.length < 2) errores.push("nombre");
  if (telefono.replace(/\D/g, "").length < 7) errores.push("telefono");
  if (!tipo) errores.push("tipo");

  if (errores.length > 0) {
    return NextResponse.json(
      { error: "Faltan campos o son inválidos", campos: errores },
      { status: 422 },
    );
  }

  // ---- Sustituye esto por tu envío real ------------------------------
  console.info("[cotización] nueva solicitud", { nombre, telefono, tipo });
  // --------------------------------------------------------------------

  return NextResponse.json({ ok: true }, { status: 200 });
}
