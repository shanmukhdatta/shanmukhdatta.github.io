import type { NextRequest } from 'next/server';
import {trustedOrigin, logOut} from '@/lib/cms-auth';
import {json} from '@/lib/cms-response';
export const runtime='nodejs';
export async function POST(req:NextRequest){if(!trustedOrigin(req))return json({error:'Untrusted request origin'},403);try{await logOut();return json({authenticated:false})}catch{return json({error:'Could not close session'},503)}}
