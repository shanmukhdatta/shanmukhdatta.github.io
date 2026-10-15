import 'server-only';
import {config} from './config';
export async function mail(to:string,subject:string,text:string,replyTo?:string){
 if(!config.resend||!config.sender)throw new Error('Mailer not configured');
 const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+config.resend,'Content-Type':'application/json'},body:JSON.stringify({from:config.sender,to:[to],subject,text,...(replyTo?{reply_to:replyTo}:{})}),cache:'no-store'});
 if(!r.ok)throw new Error('Mail delivery provider failed');
 const data=await r.json() as {id?:string};if(!data.id)throw new Error('No delivery confirmation from email provider');return data.id;
}
