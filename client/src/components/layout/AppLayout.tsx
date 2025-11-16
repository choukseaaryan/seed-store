import { Outlet } from 'react-router-dom';
import { UpdateNotification } from '../UpdateNotification';
import Layout from './Layout';

export default function AppLayout() {
  return (
    <Layout>
      <UpdateNotification />
      <Outlet />
    </Layout>
  );
}
