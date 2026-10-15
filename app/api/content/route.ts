import {liveData} from '../../../lib/portfolio-store';
export const dynamic='force-dynamic';
export async function GET(){return Response.json(await liveData(),{headers:{'Cache-Control':'public, max-age=60, stale-while-revalidate=300'}});}
