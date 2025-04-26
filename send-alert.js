const WebSocket = require('ws');

// Connect to the WebSocket server - using Docker's network alias
const ws = new WebSocket('ws://api-server:3000/ws');

ws.on('open', function open() {
  console.log('Connected to WebSocket server');
  
  // Create an alert message
  const alertMessage = {
    type: 'ai_alert',
    payload: {
      timestamp: Date.now(),
      summary: 'SSH Brute Force Attack Detected',
      severity: 'high',
      suggested_playbook: 'Isolate affected system, block source IP, and investigate user accounts for compromise.',
      affected_system: 'server-01',
      source_ip: '192.168.1.100',
      indicators: [
        {
          type: 'ip',
          value: '192.168.1.100',
          context: 'Source of brute force login attempts'
        },
        {
          type: 'user',
          value: 'admin',
          context: 'Target user account'
        }
      ]
    }
  };
  
  // Send the alert
  ws.send(JSON.stringify(alertMessage));
  console.log('Alert sent');
  
  // Also send a log message
  const logMessage = {
    type: 'log',
    payload: {
      timestamp: Date.now(),
      message: 'Multiple failed login attempts detected from 192.168.1.100',
      source: 'sshd'
    }
  };
  
  ws.send(JSON.stringify(logMessage));
  console.log('Log sent');
  
  // Close the connection after a brief delay
  setTimeout(() => {
    ws.close();
    console.log('Connection closed');
  }, 1000);
});

ws.on('message', function incoming(data) {
  console.log('Received message from server:', data.toString());
});

ws.on('error', function error(err) {
  console.error('WebSocket error:', err);
});

ws.on('close', function close() {
  console.log('Connection closed');
  process.exit(0);
}); 