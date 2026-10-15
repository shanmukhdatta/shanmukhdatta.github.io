import { Portfolio } from '../components/Portfolio';
import {liveData} from '../lib/portfolio-store';
export const dynamic='force-dynamic';
export default async function HomePage() { return <Portfolio initialData={await liveData()}/>; }
