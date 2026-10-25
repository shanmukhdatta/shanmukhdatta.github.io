import Portfolio from '@/components/Portfolio';
import { readPublicContent } from '@/lib/cms-public';
export const dynamic='force-dynamic';
export default async function HomePage(){return <Portfolio initialContent={await readPublicContent()}/>;}
