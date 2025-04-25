import React, { useEffect, useState } from 'react';
import { useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function AppContent() {
  const [alerts, setAlerts] = useState<any[]>([]);
  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_API_WS);
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === 'alert') {
        setAlerts((prev) => [msg.payload, ...prev]);
      }
    };
  }, []);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">AI Incident Responder</h1>
      <div className="mt-4">
        {alerts.map((a, i) => (
          <div key={i} className={`p-2 mb-2 border-l-4 ${{
            low: 'border-green-500',
            medium: 'border-yellow-500',
            high: 'border-red-500'
          }[a.severity]}`}>
            <h3 className="font-semibold">{a.summary}</h3>
            <small>Severity: {a.severity}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
} 