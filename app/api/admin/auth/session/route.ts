import {adminEmail,authReady} from '@/lib/cms-auth';
import { json } from '@/lib/cms-response';
export const runtime='nodejs';
export async function GET(){try{if(!authReady())return json({authenticated:false,configured:false});const email=await adminEmail();return json({authenticated:!!email,configured:true,email:email||undefined})}catch{return json({authenticated:false,configured:true,error:'Session service unavailable'},503)}}
