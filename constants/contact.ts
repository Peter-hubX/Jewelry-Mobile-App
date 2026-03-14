// constants/contact.ts
// ─────────────────────────────────────────────────────────────────────────────
// CONTACT CONFIGURATION
// Update WHATSAPP_NUMBER with your business number (international format, no +)
// ─────────────────────────────────────────────────────────────────────────────

/** WhatsApp business number — international format WITHOUT leading +
 *  Example: Egypt +20 100 123 4567 → '201001234567'
 */
export const WHATSAPP_NUMBER = '201010713400'; // ← REPLACE with your number

/**
 * Build a WhatsApp deep-link with a pre-filled Arabic message.
 * Opens WhatsApp directly to a chat with the business number.
 */
export function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

/**
 * Build the pre-filled inquiry message for a product.
 */
export function buildProductInquiryMessage(params: {
  nameAr: string;
  karat: string;
  weight: number;
  price: number;
}): string {
  return (
    `مرحباً، أود الاستفسار عن المنتج التالي:\n\n` +
    `📿 الاسم: ${params.nameAr}\n` +
    `✨ العيار: ${params.karat}\n` +
    `⚖️ الوزن: ${params.weight} جم\n` +
    `💰 السعر التقريبي: ${params.price.toLocaleString('en-US')} EGP\n\n` +
    `أرجو التواصل معي للاستفسار.`
  );
}
