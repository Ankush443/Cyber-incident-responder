// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck 

import * as React from 'react';
import { useEffect, useState, createContext, useContext } from 'react';
import { useQueryClient, QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query';

// Use a simpler approach for icons
import { 
  ShieldCheck, 
  ShieldExclamation, 
  Bell, 
  ChartBar, 
  DocumentText, 
  Cog, 
  Logout, 
  User, 
  Menu, 
  X, 
  Eye, 
  Terminal
} from 'heroicons-react';

// API config
// @ts-ignore
const API_BASE_URL = import.meta.env.VITE_API_HTTP || 'http://localhost:3000';
// @ts-ignore
const API_WS_URL = import.meta.env.VITE_API_WS || 'ws://localhost:3000/ws';

// API service functions
const ApiService = {
  // Auth endpoints
  login: async (username: string, password: string) => {
    console.log('Login attempt for user:', username);
    try {
      // Always use mock data for now to bypass backend issues
      console.log('Using mock data for login');
      const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('auth_token', mockToken);
      return { 
        username: username, 
        role: 'admin', 
        token: mockToken 
      };
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },
  
  // Get all alerts - use mock data
  getAlerts: async () => {
    console.log('Getting mock alerts');
    return [
      {
        id: '1',
        timestamp: Date.now() - 3600000,
        summary: 'SSH Brute Force Attempt Detected',
        severity: 'high',
        suggested_playbook: 'Isolate affected system, block source IP, and investigate user accounts for compromise.',
        status: 'new',
        affected_system: 'server-01',
        source_ip: '192.168.1.100'
      },
      {
        id: '2',
        timestamp: Date.now() - 7200000,
        summary: 'Suspicious File Downloaded',
        severity: 'medium',
        suggested_playbook: 'Scan downloaded file with antivirus, check browser history, monitor for unusual activity.',
        status: 'investigating',
        affected_system: 'workstation-15',
        source_ip: '203.0.113.45'
      },
      {
        id: '3',
        timestamp: Date.now() - 10800000,
        summary: 'Unusual Login Time Detected',
        severity: 'low',
        suggested_playbook: 'Verify with user if login was legitimate, check for other suspicious activity.',
        status: 'resolved',
        affected_system: 'laptop-22',
        source_ip: '10.0.0.15'
      }
    ];
  },
  
  // Get system logs - use mock data
  getLogs: async (limit = 50) => {
    console.log('Getting mock logs');
    return [
      { timestamp: Date.now() - 60000, message: 'User admin logged in', source: 'auth' },
      { timestamp: Date.now() - 120000, message: 'Firewall blocked connection from 192.168.1.100', source: 'firewall' },
      { timestamp: Date.now() - 180000, message: 'Failed password for invalid user root from 192.168.1.100', source: 'sshd' },
      { timestamp: Date.now() - 240000, message: 'New device connected to network: 00:11:22:33:44:55', source: 'dhcp' },
      { timestamp: Date.now() - 300000, message: 'System update initiated', source: 'system' }
    ];
  },
  
  // Execute response action - mock success
  executeAction: async (alertId: string, actionType: string) => {
    console.log(`Mock executing action ${actionType} for alert ${alertId}`);
    return { 
      status: 'dispatched', 
      message: `Action ${actionType} dispatched for alert ${alertId}` 
    };
  }
};

// Create auth context for user authentication
const AuthContext = createContext<{
  isAuthenticated: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
  user: { username: string; role: string } | null;
}>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  user: null
});

// Create QueryClient for data fetching
const queryClient = new QueryClient();

// Severity types with colors
const severityColors = {
  low: {
    bg: 'bg-green-100',
    border: 'border-green-500',
    text: 'text-green-800',
    icon: <ShieldCheck className="h-5 w-5 text-green-600" />
  },
  medium: {
    bg: 'bg-yellow-100',
    border: 'border-yellow-500',
    text: 'text-yellow-800',
    icon: <ShieldExclamation className="h-5 w-5 text-yellow-600" />
  },
  high: {
    bg: 'bg-red-100',
    border: 'border-red-500',
    text: 'text-red-800',
    icon: <ShieldExclamation className="h-5 w-5 text-red-600" />
  }
};

// Alert type definition
interface Alert {
  id: string;
  timestamp: number;
  summary: string;
  severity: 'low' | 'medium' | 'high';
  suggested_playbook: string;
  status: 'new' | 'investigating' | 'resolved';
  affected_system?: string;
  source_ip?: string;
  indicators?: { type: string; value: string; context: string }[];
}

// Login component
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!username || !password) {
      setError('Please enter both username and password');
      setIsLoading(false);
      return;
    }
    
    try {
      // For demo, we'll try the API first, but fall back to mock login if that fails
      try {
        const userData = await ApiService.login(username, password);
        login(userData.username, userData.role || 'admin');
      } catch (apiError) {
        // Fallback to mock login for development/demo
        if (username === 'admin' && password === 'admin') {
          login(username, 'admin');
        } else {
          throw new Error('Invalid credentials');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <ShieldCheck className="h-12 w-12 text-blue-600 mx-auto" />
          <h2 className="mt-3 text-2xl font-bold text-gray-800">Cyber Incident Responder</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        
        {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Username"
              disabled={isLoading}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
              disabled={isLoading}
            />
          </div>
          <div>
            <button
              type="submit"
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
        
        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">
            Demo credentials: admin / admin
          </p>
        </div>
      </div>
    </div>
  );
}

// Sidebar component
function Sidebar({ active, toggleSidebar }: { active: string; toggleSidebar: () => void }) {
  const { user, logout } = useContext(AuthContext);
  
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <ChartBar className="h-5 w-5" /> },
    { id: 'alerts', name: 'Alerts', icon: <Bell className="h-5 w-5" /> },
    { id: 'logs', name: 'Logs', icon: <DocumentText className="h-5 w-5" /> },
    { id: 'console', name: 'Console', icon: <Terminal className="h-5 w-5" /> },
    { id: 'settings', name: 'Settings', icon: <Cog className="h-5 w-5" /> }
  ];
  
  return (
    <div className="h-screen bg-gray-800 text-white w-64 fixed left-0 top-0 overflow-y-auto z-20">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-8 w-8 text-blue-400" />
          <h1 className="text-xl font-bold">Cyber Response</h1>
        </div>
        <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-white">
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-500 rounded-full h-8 w-8 flex items-center justify-center">
            {user?.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{user?.username}</p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
        </div>
      </div>
      
      <nav className="p-2">
        <ul>
          {menuItems.map(item => (
            <li key={item.id}>
              <a 
                href={`#${item.id}`} 
                className={`flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-700 transition duration-200 ${
                  active === item.id ? 'bg-gray-700 text-blue-400' : 'text-gray-300'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 mt-auto border-t border-gray-700">
        <button 
          onClick={logout}
          className="flex items-center space-x-2 text-gray-300 hover:text-white w-full"
        >
          <Logout className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

// Alert card component
function AlertCard({ alert, onAction }: { alert: Alert, onAction: (action: string, alert: Alert) => void }) {
  // Define severity colors
  const severityColors = {
    low: 'bg-blue-100 text-blue-800 border-blue-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200'
  };
  
  // Define status colors
  const statusColors = {
    new: 'bg-red-100 text-red-800',
    investigating: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800'
  };
  
  // Format timestamp
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };
  
  return (
    <div className={`p-4 mb-4 rounded-lg border ${severityColors[alert.severity as keyof typeof severityColors]}`}>
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">{alert.summary}</h3>
        <span className={`px-2 py-1 text-xs rounded-full ${statusColors[alert.status as keyof typeof statusColors]}`}>
          {alert.status}
        </span>
      </div>
      <div className="text-sm mt-2">
        <p>Reported at: {formatTime(alert.timestamp)}</p>
        {alert.affected_system && <p className="mt-1">System: {alert.affected_system}</p>}
        {alert.source_ip && <p className="mt-1">Source IP: {alert.source_ip}</p>}
      </div>
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => onAction('view', alert)}
          className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
        >
          View Details
        </button>
        {alert.status !== 'resolved' && (
          <button
            onClick={() => onAction('respond', alert)}
            className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Respond
          </button>
        )}
      </div>
    </div>
  );
}

// Alert detail modal
function AlertDetailModal({ alert, onClose }: { alert: Alert, onClose: () => void }) {
  if (!alert) return null;
  
  // Define severity colors
  const severityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">{alert.summary}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Alert ID</p>
              <p>{alert.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Timestamp</p>
              <p>{new Date(alert.timestamp).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Severity</p>
              <span className={`px-2 py-1 text-xs rounded-full ${severityColors[alert.severity as keyof typeof severityColors]}`}>
                {alert.severity}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p>{alert.status}</p>
            </div>
            {alert.affected_system && (
              <div>
                <p className="text-sm text-gray-500">Affected System</p>
                <p>{alert.affected_system}</p>
              </div>
            )}
            {alert.source_ip && (
              <div>
                <p className="text-sm text-gray-500">Source IP</p>
                <p>{alert.source_ip}</p>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Suggested Response Playbook</h3>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p>{alert.suggested_playbook}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Related Indicators</h3>
            <div className="mt-2 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Context</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {alert.indicators ? (
                    alert.indicators.map((indicator, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">{indicator.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{indicator.value}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{indicator.context}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                        No indicators available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded mr-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Response action modal
function ResponseModal({ 
  alert, 
  onClose, 
  onSubmit 
}: { 
  alert: Alert | null; 
  onClose: () => void; 
  onSubmit: (alert: Alert, action: string) => void;
}) {
  const [selectedAction, setSelectedAction] = useState('isolate-iface');
  
  if (!alert) return null;
  
  const actions = [
    { id: 'isolate-iface', name: 'Isolate Network Interface', description: 'Disconnect the compromised machine from the network' },
    { id: 'kill-process', name: 'Kill Malicious Process', description: 'Terminate the process associated with the attack' },
    { id: 'block-ip', name: 'Block IP Address', description: 'Add attacking IP to firewall blacklist' },
  ];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full">
        <div className="bg-blue-100 p-4 rounded-t-lg border-b border-blue-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <Terminal className="h-5 w-5 text-blue-600" />
              <span>Response Actions</span>
            </h2>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Respond to: {alert.summary}</h3>
            <p className="text-gray-600 text-sm">Select an action to mitigate this threat</p>
          </div>
          
          <div className="space-y-3 mb-6">
            {actions.map(action => (
              <div 
                key={action.id}
                className={`border rounded-lg p-3 cursor-pointer ${
                  selectedAction === action.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedAction(action.id)}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    checked={selectedAction === action.id}
                    onChange={() => setSelectedAction(action.id)}
                    className="mr-3 h-4 w-4 text-blue-600"
                  />
                  <div>
                    <h4 className="font-medium">{action.name}</h4>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSubmit(alert, selectedAction);
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Execute Action
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Log entry component
function LogEntry({ log }: { log: { timestamp: number; message: string; source: string } }) {
  return (
    <div className="py-2 border-b border-gray-200 hover:bg-gray-50">
      <div className="flex items-start">
        <div className="w-32 flex-shrink-0">
          <span className="text-xs text-gray-500">
            {new Date(log.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <div className="flex-1">
          <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800 mr-2">
            {log.source}
          </span>
          <span className="text-sm">{log.message}</span>
        </div>
      </div>
    </div>
  );
}

// Main dashboard component
function Dashboard() {
  console.log('Dashboard component rendering');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [alertModalData, setAlertModalData] = useState<Alert | null>(null);
  const [responseModalData, setResponseModalData] = useState<Alert | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Simple debug log
  useEffect(() => {
    console.log('Dashboard component mounted');
    
    // Log when tabs change
    console.log('Active tab set to:', activeTab);
  }, [activeTab]);
  
  // Load alerts using React Query
  const { 
    data: alertsData,
    isLoading: alertsLoading,
    error: alertsError,
    refetch: refetchAlerts
  } = useQuery(['alerts'], ApiService.getAlerts, {
    refetchInterval: 30000, // Refetch every 30s
    onError: (err) => console.error('Failed to fetch alerts:', err),
    // If API fails, provide fallback data
    placeholderData: [
      {
        id: '1',
        timestamp: Date.now() - 3600000,
        summary: 'SSH Brute Force Attempt Detected',
        severity: 'high',
        suggested_playbook: 'Isolate affected system, block source IP, and investigate user accounts for compromise.',
        status: 'new'
      },
      {
        id: '2',
        timestamp: Date.now() - 7200000,
        summary: 'Suspicious File Downloaded',
        severity: 'medium',
        suggested_playbook: 'Scan downloaded file with antivirus, check browser history, monitor for unusual activity.',
        status: 'investigating'
      },
      {
        id: '3',
        timestamp: Date.now() - 10800000,
        summary: 'Unusual Login Time Detected',
        severity: 'low',
        suggested_playbook: 'Verify with user if login was legitimate, check for other suspicious activity.',
        status: 'resolved'
      }
    ]
  });
  
  // Load logs using React Query
  const {
    data: logsData,
    isLoading: logsLoading,
    error: logsError,
    refetch: refetchLogs
  } = useQuery(['logs'], () => ApiService.getLogs(100), {
    refetchInterval: 20000, // Refetch every 20s
    onError: (err) => console.error('Failed to fetch logs:', err),
    // If API fails, provide fallback data
    placeholderData: [
      { timestamp: Date.now() - 60000, message: 'User admin logged in', source: 'auth' },
      { timestamp: Date.now() - 120000, message: 'Firewall blocked connection from 192.168.1.100', source: 'firewall' },
      { timestamp: Date.now() - 180000, message: 'Failed password for invalid user root from 192.168.1.100', source: 'sshd' },
      { timestamp: Date.now() - 240000, message: 'New device connected to network: 00:11:22:33:44:55', source: 'dhcp' },
      { timestamp: Date.now() - 300000, message: 'System update initiated', source: 'system' }
    ]
  });
  
  // Mutation for executing response actions
  const executeActionMutation = useMutation(
    ({ alertId, actionType }: { alertId: string; actionType: string }) => 
      ApiService.executeAction(alertId, actionType),
    {
      onSuccess: () => {
        refetchAlerts();
        refetchLogs();
      }
    }
  );
  
  // Compute stats based on alerts data
  const stats = {
    totalAlerts: alertsData?.length || 0,
    highSeverity: alertsData?.filter(a => a.severity === 'high').length || 0,
    resolvedIncidents: alertsData?.filter(a => a.status === 'resolved').length || 0,
    attackSources: 3 // For demo purposes
  };
  
  // Handle alert actions
  const handleAlertAction = (action: string, alert: Alert) => {
    if (action === 'view') {
      setAlertModalData(alert);
    } else if (action === 'respond') {
      setResponseModalData(alert);
    }
  };
  
  // Handle response action submission
  const handleResponseSubmit = (alert: Alert, action: string) => {
    // Execute the action via API
    executeActionMutation.mutate({ 
      alertId: alert.id, 
      actionType: action 
    });
    
    // Optimistically update the UI
    if (alertsData) {
      const updatedAlerts = alertsData.map(a => 
        a.id === alert.id ? { ...a, status: 'investigating' } : a
      );
      
      // Manually update the query cache
      const queryClient = useQueryClient();
      queryClient.setQueryData(['alerts'], updatedAlerts);
      
      // Simulate a successful response in 2 seconds for demo purposes
      setTimeout(() => {
        const resolvedAlerts = updatedAlerts.map(a => 
          a.id === alert.id ? { ...a, status: 'resolved' } : a
        );
        queryClient.setQueryData(['alerts'], resolvedAlerts);
      }, 2000);
    }
  };

  // Add debug section that shows the actual data being loaded
  // This simplified debugging view will always be visible
  const renderDebugView = () => {
    return (
      <div style={{padding: '20px', margin: '20px 0', border: '2px dashed red', backgroundColor: '#ffe', borderRadius: '5px'}}>
        <h2 style={{color: 'red'}}>Debug Information</h2>
        
        <div style={{marginBottom: '10px'}}>
          <strong>Current Tab:</strong> {activeTab}
        </div>
        
        <div style={{marginBottom: '10px'}}>
          <strong>Alerts Data Status:</strong> {alertsLoading ? 'Loading...' : alertsError ? 'Error loading' : 'Loaded'}
          {alertsError && <div style={{color: 'red'}}>{String(alertsError)}</div>}
        </div>
        
        <div style={{marginBottom: '10px'}}>
          <strong>Logs Data Status:</strong> {logsLoading ? 'Loading...' : logsError ? 'Error loading' : 'Loaded'}
          {logsError && <div style={{color: 'red'}}>{String(logsError)}</div>}
        </div>
        
        <div style={{marginBottom: '10px'}}>
          <strong>Alert Count:</strong> {alertsData?.length || 0}
        </div>
        
        <div style={{marginBottom: '10px'}}>
          <strong>Log Count:</strong> {logsData?.length || 0}
        </div>
        
        <h3 style={{marginTop: '15px', marginBottom: '10px'}}>Sample Data:</h3>
        
        <div style={{display: 'flex', gap: '20px'}}>
          <div style={{flex: 1}}>
            <h4>First Alert:</h4>
            {alertsData && alertsData.length > 0 ? (
              <pre style={{fontSize: '12px', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto', maxHeight: '150px'}}>
                {JSON.stringify(alertsData[0], null, 2)}
              </pre>
            ) : (
              <p>No alerts available</p>
            )}
          </div>
          
          <div style={{flex: 1}}>
            <h4>First Log:</h4>
            {logsData && logsData.length > 0 ? (
              <pre style={{fontSize: '12px', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto', maxHeight: '150px'}}>
                {JSON.stringify(logsData[0], null, 2)}
              </pre>
            ) : (
              <p>No logs available</p>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // Connect to WebSocket for real-time updates
  useEffect(() => {
    try {
      // Connect to WebSocket for real-time updates
      console.log('Attempting to connect to WebSocket at:', API_WS_URL);
      const ws = new WebSocket(API_WS_URL);
      const queryClient = useQueryClient();
      
      ws.onmessage = (e) => {
        try {
          console.log('WebSocket message received:', e.data);
          const msg = JSON.parse(e.data);
          if (msg.type === 'ai_alert' && msg.payload) {
            const newAlert: Alert = {
              id: Date.now().toString(),
              timestamp: msg.payload.timestamp || Date.now(),
              summary: msg.payload.summary || 'Unknown alert',
              severity: msg.payload.severity || 'medium',
              suggested_playbook: msg.payload.suggested_playbook || 'Investigate and respond accordingly.',
              status: 'new'
            };
            
            // Add to existing alerts
            const currentAlerts = queryClient.getQueryData<Alert[]>(['alerts']) || [];
            queryClient.setQueryData(['alerts'], [newAlert, ...currentAlerts]);
            
            // Send a browser notification (if permission granted)
            if (Notification.permission === 'granted') {
              new Notification('New Security Alert', {
                body: newAlert.summary,
                icon: '/favicon.ico'
              });
            }
          } else if (msg.type === 'log') {
            // Add to existing logs
            const currentLogs = queryClient.getQueryData<any[]>(['logs']) || [];
            queryClient.setQueryData(['logs'], [msg.payload, ...currentLogs.slice(0, 99)]);
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };
      
      ws.onopen = () => {
        console.log('WebSocket connected successfully');
      };
      
      ws.onerror = (e) => {
        console.error('WebSocket error:', e);
      };
      
      // Request notification permission
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          console.log('Notification permission:', permission);
        });
      }
      
      return () => {
        console.log('Closing WebSocket connection');
        ws.close();
      };
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
    }
  }, []);
  
  // Modified version of renderContent that includes the debug view
  const renderContent = () => {
    // Always render the debug section first
    return (
      <>
        {renderDebugView()}
        
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Security Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                <h3 className="text-gray-500 text-sm">Total Alerts</h3>
                <p className="text-2xl font-bold">{stats.totalAlerts}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
                <h3 className="text-gray-500 text-sm">High Severity</h3>
                <p className="text-2xl font-bold">{stats.highSeverity}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                <h3 className="text-gray-500 text-sm">Resolved</h3>
                <p className="text-2xl font-bold">{stats.resolvedIncidents}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
                <h3 className="text-gray-500 text-sm">Attack Sources</h3>
                <p className="text-2xl font-bold">{stats.attackSources}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200 p-4">
                <h3 className="text-lg font-semibold">Recent Alerts</h3>
              </div>
              <div className="p-4">
                {alertsData?.slice(0, 3).map(alert => (
                  <AlertCard 
                    key={alert.id} 
                    alert={alert} 
                    onAction={handleAlertAction} 
                  />
                ))}
                {alertsData?.length > 3 && (
                  <button 
                    onClick={() => setActiveTab('alerts')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View all alerts →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'alerts' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Security Alerts</h2>
            
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200 p-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">All Alerts</h3>
                <div className="flex space-x-2">
                  <select className="border rounded p-1 text-sm">
                    <option>All Severities</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                  <select className="border rounded p-1 text-sm">
                    <option>All Statuses</option>
                    <option>New</option>
                    <option>Investigating</option>
                    <option>Resolved</option>
                  </select>
                </div>
              </div>
              <div className="p-4">
                {alertsData?.length > 0 ? (
                  alertsData.map(alert => (
                    <AlertCard 
                      key={alert.id} 
                      alert={alert} 
                      onAction={handleAlertAction} 
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No alerts found</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'logs' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">System Logs</h2>
            
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200 p-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Log Events</h3>
                <div className="flex space-x-2">
                  <select className="border rounded p-1 text-sm">
                    <option>All Sources</option>
                    <option>auth</option>
                    <option>firewall</option>
                    <option>sshd</option>
                    <option>dhcp</option>
                    <option>system</option>
                  </select>
                  <button className="border rounded p-1 text-sm bg-gray-100 hover:bg-gray-200 px-2">
                    Refresh
                  </button>
                </div>
              </div>
              <div className="p-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                {logsData?.length > 0 ? (
                  logsData.map((log, index) => (
                    <LogEntry key={index} log={log} />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No logs found</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'console' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Command Console</h2>
            
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200 p-4">
                <h3 className="text-lg font-semibold">Execute Response Actions</h3>
              </div>
              <div className="p-4">
                <div className="bg-gray-900 text-green-400 font-mono p-4 rounded h-64 overflow-y-auto mb-4">
                  <p>{"> Ready for command input"}</p>
                  <p>{"> Type 'help' for available commands"}</p>
                </div>
                
                <div className="flex">
                  <input 
                    type="text" 
                    className="flex-1 border border-gray-300 rounded-l p-2 font-mono" 
                    placeholder="Enter command..." 
                  />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700">
                    Execute
                  </button>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2">Quick Actions:</h4>
                  <div className="flex flex-wrap gap-2">
                    <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm">
                      isolate-host 192.168.1.100
                    </button>
                    <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm">
                      block-ip 10.0.0.5
                    </button>
                    <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm">
                      kill-process 1234
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200 p-4">
                <h3 className="text-lg font-semibold">System Configuration</h3>
              </div>
              <div className="p-4">
                <div className="mb-6">
                  <h4 className="text-md font-semibold mb-3">Notification Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input type="checkbox" id="notify-high" className="mr-2" defaultChecked />
                      <label htmlFor="notify-high">High severity alerts</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="notify-medium" className="mr-2" defaultChecked />
                      <label htmlFor="notify-medium">Medium severity alerts</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="notify-low" className="mr-2" />
                      <label htmlFor="notify-low">Low severity alerts</label>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-md font-semibold mb-3">System Integration</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fluvio Server
                      </label>
                      <input 
                        type="text" 
                        className="border rounded p-2 w-full" 
                        defaultValue="localhost:9003" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        API Server
                      </label>
                      <input 
                        type="text" 
                        className="border rounded p-2 w-full" 
                        defaultValue="http://localhost:3000" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <button 
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-20 bg-gray-800 text-white p-2 rounded-md"
      >
        <Menu className="h-6 w-6" />
      </button>
      
      {/* Sidebar */}
      <div className={`lg:block ${sidebarOpen ? 'block' : 'hidden'}`}>
        <Sidebar active={activeTab} toggleSidebar={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main content */}
      <div className="lg:ml-64 p-8">
        {renderContent()}
      </div>
      
      {/* Alert detail modal */}
      {alertModalData && (
        <AlertDetailModal 
          alert={alertModalData} 
          onClose={() => setAlertModalData(null)} 
        />
      )}
      
      {/* Response action modal */}
      {responseModalData && (
        <ResponseModal
          alert={responseModalData}
          onClose={() => setResponseModalData(null)}
          onSubmit={handleResponseSubmit}
        />
      )}
    </div>
  );
}

// Main App component with authentication
function AppContent() {
  // Start authenticated with a mock user for testing
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState({ username: 'admin', role: 'admin' });
  
  console.log('AppContent rendering, authenticated:', isAuthenticated, 'user:', user);
  
  const login = (username: string, role: string) => {
    console.log('Setting authenticated state for:', username, role);
    setUser({ username, role });
    setIsAuthenticated(true);
  };
  
  const logout = () => {
    console.log('Logging out');
    setUser(null);
    setIsAuthenticated(false);
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {isAuthenticated ? (
        <>
          <div style={{position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, backgroundColor: '#f00', color: '#fff', padding: '5px', textAlign: 'center'}}>
            Debug: Dashboard should appear below this message
          </div>
          <Dashboard />
        </>
      ) : (
        <Login />
      )}
    </AuthContext.Provider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
} 