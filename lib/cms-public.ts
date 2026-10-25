import 'server-only';
import { dbReady,loadChanges } from './cms-db';
import {defaultPortfolio, publicPortfolio} from './cms-schema';

export async function readPublicContent(){
 if(!dbReady())return defaultPortfolio();
 try{return publicPortfolio(await loadChanges())}
 catch(error){console.error('CMS content database unavailable',error instanceof Error?error.message:'unknown');return defaultPortfolio()}
}
