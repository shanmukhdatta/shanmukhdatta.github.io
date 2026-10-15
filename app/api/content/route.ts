import {liveData} from '../../../lib/portfolio-store';
export const dynamic='force-dynamic';
export async function GET(){return Response.json(await liveData(),{headers:{'Cache-Control':'no-store'}});}
