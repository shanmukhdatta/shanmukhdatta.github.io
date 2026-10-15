import type { Metadata } from 'next';
import { ArchivePage } from '../../components/ArchivePage';
export const metadata: Metadata = { title:'Project Library', description:'Explore researched, built, prototyped and planned work in AI and software engineering.'};
export default function ProjectsIndex() {return <ArchivePage/>;}
