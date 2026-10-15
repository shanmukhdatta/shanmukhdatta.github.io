import type { Metadata } from 'next';
import { ControlCenter } from '../../components/admin/ControlCenter';
export const metadata: Metadata = {
  title: 'Private Control Center',
  robots: { index: false, follow: false },
};
export default function AdminPage() {
  return <ControlCenter />;
}
