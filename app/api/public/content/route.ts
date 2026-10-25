import { readPublicContent } from '@/lib/cms-public';
import { json } from '@/lib/cms-response';
export const dynamic='force-dynamic';
export async function GET(){return json(await readPublicContent())}
