import 'server-only';
import {cache} from 'react';
import {validateDocument} from './validate';
import {publishedDocuments} from './db';
import {projects, type Project} from '../content/projects';
import {milestones, mindTopics, site, skills} from '../content/site';
export type PublicData={site:typeof site;milestones:typeof milestones;mindTopics:typeof mindTopics;skills:typeof skills;projects:Project[]};
export const baseline:PublicData={site,milestones,mindTopics,skills,projects};
export const liveData=cache(async():Promise<PublicData>=>{
  let docs:Record<string,unknown>={};try{docs=await publishedDocuments();}catch{ /* Safe read-only static fallback before Supabase setup. */ }
  const pick=<T>(key:string,original:T):T=>{if(docs[key]===undefined)return original;try{validateDocument(key,docs[key]);return docs[key] as T;}catch{return original;}};
  return {site:pick('site',site),milestones:pick('milestones',milestones),mindTopics:pick('mindTopics',mindTopics),skills:pick('skills',skills),projects:pick('projects',projects)};
});
export async function projectBySlug(slug:string){return (await liveData()).projects.find(p=>p.slug===slug);}
