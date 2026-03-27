// Kommo CRM Integration — JSON Mapping & Submission

export interface LeadFormData {
  eventName: string;
  date: string;
  band: string;
  phone: string;
  budget: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  page_url: string;
}

/**
 * JSON Mapping: Form Fields → Kommo CRM Fields
 * 
 * Form Field      → Kommo Field ID     → Kommo Field Name
 * ─────────────────────────────────────────────────────────
 * eventName       → custom_field_1      → "Nombre del Evento"
 * date            → custom_field_2      → "Fecha del Evento"
 * band            → custom_field_3      → "Banda Solicitada"
 * phone           → phone               → "Teléfono"
 * budget          → custom_field_4      → "Presupuesto"
 * utm_source      → custom_field_5      → "UTM Source"
 * utm_medium      → custom_field_6      → "UTM Medium"
 * utm_campaign    → custom_field_7      → "UTM Campaign"
 * page_url        → custom_field_8      → "URL de Origen"
 */

export function mapToKommoPayload(data: LeadFormData) {
  return {
    name: `Lead: ${data.eventName} — ${data.band}`,
    custom_fields_values: [
      { field_id: "custom_field_1", values: [{ value: data.eventName }] },
      { field_id: "custom_field_2", values: [{ value: data.date }] },
      { field_id: "custom_field_3", values: [{ value: data.band }] },
      { field_id: "custom_field_4", values: [{ value: data.budget }] },
      { field_id: "custom_field_5", values: [{ value: data.utm_source }] },
      { field_id: "custom_field_6", values: [{ value: data.utm_medium }] },
      { field_id: "custom_field_7", values: [{ value: data.utm_campaign }] },
      { field_id: "custom_field_8", values: [{ value: data.page_url }] },
    ],
    _embedded: {
      contacts: [
        {
          custom_fields_values: [
            { field_id: "phone", values: [{ value: data.phone, enum_code: "WORK" }] },
          ],
        },
      ],
    },
  };
}

// Replace KOMMO_WEBHOOK_URL with your actual Kommo webhook URL
const KOMMO_WEBHOOK_URL = "/api/leads";

export async function submitLead(data: LeadFormData): Promise<boolean> {
  const payload = mapToKommoPayload(data);

  try {
    const response = await fetch(KOMMO_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch (error) {
    console.error("Error submitting lead:", error);
    return false;
  }
}
