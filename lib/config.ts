import 'server-only';
export const config = {
  supabaseUrl: process.env.SUPABASE_URL || '',
  serviceRole: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  secret: process.env.SESSION_SECRET || '',
  email: process.env.ADMIN_EMAIL || '',
  resend: process.env.RESEND_API_KEY || '',
  sender: process.env.MAIL_FROM || '',
  contactTo: process.env.CONTACT_TO_EMAIL || process.env.ADMIN_EMAIL || '',
  groq: process.env.GROQ_API_KEY || '',
  groqModel: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
};
export function backendReady() {
  return Boolean(config.supabaseUrl && config.serviceRole && config.secret && config.email);
}
