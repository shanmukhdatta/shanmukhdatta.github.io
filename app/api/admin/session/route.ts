import {authorized} from '../../../../lib/security';
export const dynamic='force-dynamic';
export async function GET(){return Response.json({authorized:await authorized()},{headers:{'Cache-Control':'no-store'}});}
