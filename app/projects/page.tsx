import {liveData} from '../../lib/portfolio-store';
import type { Metadata } from 'next';
import { ArchivePage } from '../../components/ArchivePage';
export const metadata: Metadata = { title:'Project Library', description:'Explore researched, built, prototyped and planned work in AI and software engineering.'};
export const dynamic='force-dynamic';
export default async function ProjectsIndex() {return <ArchivePage initialProjects={(await liveData()).projects}/>;}
