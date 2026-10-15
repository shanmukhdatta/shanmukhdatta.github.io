import { NextResponse, type NextRequest } from 'next/server';
import { validateDocument } from './lib/validate';
export async function middleware(request: NextRequest) {
  const base = process.env.SUPABASE_URL,
    key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) return NextResponse.next();
  try {
    const response = await fetch(
      base.replace(/\/$/, '') + '/rest/v1/portfolio_documents?key=eq.seo&select=published',
      {
        headers: { apikey: key, Authorization: 'Bearer ' + key },
        signal: AbortSignal.timeout(2000),
      },
    );
    if (!response.ok) return NextResponse.next();
    const rows = await response.json();
    const seo = rows[0]?.published;
    if (!seo) return NextResponse.next();
    validateDocument('seo', seo);
    const normal = (p: string) => p.replace(/\/$/, '') || '/';
    const rule = seo.redirects.find(
      (r: { from: string }) => normal(r.from) === normal(request.nextUrl.pathname),
    );
    if (rule) {
      const url = request.nextUrl.clone();
      url.pathname = rule.to;
      return NextResponse.redirect(url, rule.permanent ? 308 : 307);
    }
  } catch {
    /* Redirect service failure must never make the portfolio unavailable. */
  }
  return NextResponse.next();
}
export const config = { matcher: ['/((?!api|_next|favicon|opengraph-image|demo|.*\\.).*)'] };
