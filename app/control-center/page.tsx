import type {Metadata} from 'next';
import ControlCenter from '@/components/admin/ControlCenter';
export const metadata:Metadata={title:'Portfolio Control Center',robots:{index:false,follow:false}};
export const dynamic='force-dynamic';
export default function AdminPage(){return <ControlCenter/>}
