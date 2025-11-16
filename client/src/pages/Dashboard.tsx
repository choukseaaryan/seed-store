import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Dashboard() {

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <p className="text-xl font-bold text-gray-900">Dashboard</p>
        <Link to="/pos">
          <Button variant="contained">New Sale</Button>
        </Link>
      </div>

      {/* Dashboard content will be added here */}
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">Welcome to Seed Store Dashboard</p>
        <p className="text-sm text-gray-500 mt-2">Start by creating a new sale or managing your inventory.</p>
      </div>
    </div>
  );
}
