// components/SyncButton.jsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from 'lucide-react';
import axios from 'axios';

export function SyncButton() {
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);

  const handleSync = async () => {
    try {
      setSyncing(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      await axios.post(
        'https://jobjinxbackend.vercel.app/api/individuals/sync',
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      alert('Sync completed successfully!');
    } catch (err) {
      console.error('Sync error:', err);
      setError(err.response?.data?.message || 'Error during sync');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleSync}
        disabled={syncing}
        className="bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        {syncing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Syncing...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Individuals
          </>
        )}
      </Button>
      {error && (
        <div className="mt-2 text-red-500 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}