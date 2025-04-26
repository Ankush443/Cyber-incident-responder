#!/usr/bin/env node
const readline = require('readline');

// Simulate the detection and response to a cyber attack
// This script demonstrates what the full system would do if Fluvio was working correctly

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bold: '\x1b[1m'
};

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Log the event with timestamp
function log(message, color = colors.white) {
  const timestamp = new Date().toISOString();
  console.log(`${colors.gray}[${timestamp}]${colors.reset} ${color}${message}${colors.reset}`);
}

// Simulate stream of logs coming in
function simulateLogStream() {
  log('Starting log stream monitor...', colors.cyan);
  
  const logMessages = [
    'User admin logged in successfully from 10.0.0.5',
    'System update check completed',
    'Backup process started',
    'Failed password for invalid user root from 192.168.1.100 port 52231 ssh2',
    'Failed password for invalid user admin from 192.168.1.100 port 52235 ssh2',
    'Failed password for invalid user admin from 192.168.1.100 port 52240 ssh2',
    'Failed password for invalid user admin from 192.168.1.100 port 52245 ssh2',
    'Failed password for invalid user admin from 192.168.1.100 port 52250 ssh2',
    'Failed password for invalid user admin from 192.168.1.100 port 52255 ssh2',
    'Failed password for invalid user admin from 192.168.1.100 port 52260 ssh2',
    'Failed password for invalid user root from 192.168.1.100 port 52265 ssh2',
    'User jsmith accessed payroll database',
    'Daily backup completed successfully'
  ];
  
  // Print logs with random delays
  let index = 0;
  const interval = setInterval(() => {
    if (index < logMessages.length) {
      let message = logMessages[index];
      if (message.includes('Failed password')) {
        log(`[sshd] ${message}`, colors.yellow);
      } else {
        log(`[system] ${message}`, colors.gray);
      }
      index++;
    } else {
      clearInterval(interval);
      setTimeout(detectAttack, 1000);
    }
  }, 300);
}

// Simulate AI detection of an attack
function detectAttack() {
  log('', colors.reset);
  log('╔════════════════════════════════════════════════════════════╗', colors.red);
  log('║                    THREAT DETECTED                         ║', colors.red + colors.bold);
  log('╚════════════════════════════════════════════════════════════╝', colors.red);
  
  log('', colors.reset);
  log('AI Processor analyzing login patterns...', colors.cyan);
  
  setTimeout(() => {
    log('Pattern analysis complete. Generating alert...', colors.cyan);
    setTimeout(displayAlert, 1000);
  }, 1500);
}

// Display the detected alert
function displayAlert() {
  const alert = {
    id: `INC-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString(),
    summary: 'SSH Brute Force Attack Detected',
    severity: 'HIGH',
    source_ip: '192.168.1.100',
    affected_system: 'server-01',
    suggested_playbook: 'Isolate affected system, block source IP, investigate user accounts',
    evidence: '8 failed login attempts in 20 seconds from same IP',
    indicators: [
      { type: 'ip', value: '192.168.1.100', context: 'Source of brute force attempts' },
      { type: 'user', value: 'admin', context: 'Target user account' },
      { type: 'service', value: 'sshd', context: 'Targeted service' }
    ]
  };

  log('', colors.reset);
  log('🚨 SECURITY ALERT 🚨', colors.bgRed + colors.white + colors.bold);
  log(`Alert ID: ${alert.id}`, colors.white + colors.bold);
  log(`Summary: ${alert.summary}`, colors.red + colors.bold);
  log(`Severity: ${alert.severity}`, colors.red);
  log(`Time: ${alert.timestamp}`, colors.white);
  log(`Source IP: ${alert.source_ip}`, colors.white);
  log(`Affected System: ${alert.affected_system}`, colors.white);
  log(`Evidence: ${alert.evidence}`, colors.yellow);
  
  log('', colors.reset);
  log('Indicators of Compromise:', colors.magenta);
  alert.indicators.forEach(ioc => {
    log(`  • ${ioc.type.toUpperCase()}: ${ioc.value} (${ioc.context})`, colors.magenta);
  });
  
  log('', colors.reset);
  log('Suggested Response:', colors.green);
  log(`  ${alert.suggested_playbook}`, colors.green);
  
  log('', colors.reset);
  setTimeout(promptForAction, 1000, alert);
}

// Prompt the user for a response action
function promptForAction(alert) {
  log('Available response actions:', colors.cyan);
  log('1. Block source IP (192.168.1.100)', colors.cyan);
  log('2. Isolate affected system (server-01)', colors.cyan);
  log('3. Reset admin credentials', colors.cyan);
  log('4. Run forensic analysis', colors.cyan);
  log('', colors.reset);
  
  rl.question(colors.bold + 'Select response action (1-4): ' + colors.reset, (answer) => {
    const action = parseInt(answer);
    if (action >= 1 && action <= 4) {
      executeAction(action, alert);
    } else {
      log('Invalid selection. Please choose a number between 1-4.', colors.red);
      promptForAction(alert);
    }
  });
}

// Execute the selected response action
function executeAction(actionNumber, alert) {
  let actionName = '';
  let commandOutput = '';
  
  switch (actionNumber) {
    case 1:
      actionName = 'Block source IP';
      commandOutput = 'Adding 192.168.1.100 to firewall blacklist... IP blocked successfully.';
      break;
    case 2:
      actionName = 'Isolate affected system';
      commandOutput = 'Disconnecting server-01 from network... System isolated successfully.';
      break;
    case 3:
      actionName = 'Reset admin credentials';
      commandOutput = 'Resetting admin account... New credentials generated and stored in secure vault.';
      break;
    case 4:
      actionName = 'Run forensic analysis';
      commandOutput = 'Initiating forensic snapshot... Memory dump complete. Starting analysis process.';
      break;
  }
  
  log('', colors.reset);
  log(`Executing action: ${actionName}`, colors.blue + colors.bold);
  log(`Command: execute-response --alert=${alert.id} --action=${actionName.toLowerCase().replace(/\s+/g, '-')}`, colors.gray);
  
  // Simulate command execution with a spinner
  const spinChars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  process.stdout.write(colors.yellow + spinChars[i] + ' Executing...' + colors.reset);
  
  const spinnerInterval = setInterval(() => {
    i = (i + 1) % spinChars.length;
    process.stdout.write('\r' + colors.yellow + spinChars[i] + ' Executing...' + colors.reset);
  }, 100);
  
  setTimeout(() => {
    clearInterval(spinnerInterval);
    process.stdout.write('\r' + colors.green + '✓ Action completed' + colors.reset + '                       \n');
    log(commandOutput, colors.green);
    
    setTimeout(() => {
      log('', colors.reset);
      log('Updating alert status to RESOLVED', colors.green);
      log(`Alert ${alert.id} closed successfully`, colors.green + colors.bold);
      log('', colors.reset);
      log('Demo complete. Exiting...', colors.gray);
      rl.close();
    }, 1000);
  }, 3000);
}

// Start the demo
console.clear();
log('╔════════════════════════════════════════════════════════════╗', colors.blue);
log('║             AI CYBER INCIDENT RESPONDER DEMO               ║', colors.blue + colors.bold);
log('╚════════════════════════════════════════════════════════════╝', colors.blue);
log('Initializing security monitoring system...', colors.cyan);

setTimeout(() => {
  log('Connected to log streams successfully', colors.green);
  setTimeout(simulateLogStream, 500);
}, 1000);

// Handle exit
rl.on('close', () => {
  console.log(colors.reset);  // Reset colors
  process.exit(0);
}); 