// components/Unauthorized.jsx
import React from 'react';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <Shield className="h-20 w-20 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-4">
          Access Denied
        </h1>
        <p className="text-gray-400 mb-8">
          You don't have permission to access this page.
        </p>
        <Button
          onClick={() => navigate('/home')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;