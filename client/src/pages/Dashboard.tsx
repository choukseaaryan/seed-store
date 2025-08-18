import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { FocusableElement } from '../components/FocusableElement';
import { useKeyboard } from '../hooks/useKeyboard';

export default function Dashboard() {
  const { isKeyboardMode } = useKeyboard();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <p className="text-xl font-bold text-gray-900">Dashboard</p>
        <FocusableElement>
          <Link to="/pos">
            <Button variant="contained">New Sale</Button>
          </Link>
        </FocusableElement>
      </div>

      {/* Show keyboard mode indicator */}
      {isKeyboardMode && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded text-sm">
          🎯 Keyboard mode active - Use Tab to navigate, Enter to activate
        </div>
      )}

      {/* Dashboard content will be added here */}
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">Welcome to Seed Store Dashboard</p>
        <p className="text-sm text-gray-500 mt-2">Start by creating a new sale or managing your inventory.</p>
      </div>
    </div>
  );
}
