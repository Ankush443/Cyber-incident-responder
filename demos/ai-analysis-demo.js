#!/usr/bin/env node
const readline = require('readline');

// Colors for console output
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

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Sample SSH log entries
const sshLogs = [
  "Apr 26 10:15:02 server-01 sshd[12345]: Failed password for invalid user root from 192.168.1.100 port 52231 ssh2",
  "Apr 26 10:15:06 server-01 sshd[12346]: Failed password for invalid user admin from 192.168.1.100 port 52235 ssh2",
  "Apr 26 10:15:09 server-01 sshd[12347]: Failed password for invalid user admin from 192.168.1.100 port 52240 ssh2",
  "Apr 26 10:15:12 server-01 sshd[12348]: Failed password for invalid user admin from 192.168.1.100 port 52245 ssh2",
  "Apr 26 10:15:15 server-01 sshd[12349]: Failed password for invalid user admin from 192.168.1.100 port 52250 ssh2",
  "Apr 26 10:15:18 server-01 sshd[12350]: Failed password for invalid user admin from 192.168.1.100 port 52255 ssh2",
  "Apr 26 10:15:21 server-01 sshd[12351]: Failed password for invalid user admin from 192.168.1.100 port 52260 ssh2",
  "Apr 26 10:15:24 server-01 sshd[12352]: Failed password for invalid user root from 192.168.1.100 port 52265 ssh2"
];

function typeWriter(text, speed = 20, color = colors.white) {
  return new Promise(resolve => {
    let i = 0;
    
    function type() {
      if (i < text.length) {
        process.stdout.write(color + text.charAt(i) + colors.reset);
        i++;
        setTimeout(type, speed);
      } else {
        process.stdout.write('\n');
        resolve();
      }
    }
    
    type();
  });
}

async function simulateLLMAnalysis() {
  console.clear();
  
  // Display title
  console.log('\n' + colors.bold + colors.blue + '┌─────────────────────────────────────────────────────┐');
  console.log('│           GROQ LOG ANALYSIS SIMULATION            │');
  console.log('└─────────────────────────────────────────────────────┘' + colors.reset + '\n');
  
  await typeWriter('Loading system logs...', 10, colors.cyan);
  console.log('\n');
  
  // Display logs
  console.log(colors.yellow + 'SSH Log Entries:' + colors.reset);
  for (const log of sshLogs) {
    console.log(colors.gray + log + colors.reset);
  }
  console.log('\n');
  
  await typeWriter('Sending logs to Groq LLM API for analysis...', 15, colors.cyan);
  
  // Simulate API call with spinner
  process.stdout.write(colors.cyan);
  const spinChars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  const spinner = setInterval(() => {
    process.stdout.write(`\rAnalyzing log patterns ${spinChars[i]} `);
    i = (i + 1) % spinChars.length;
  }, 80);
  
  // Wait for "analysis" to complete
  await new Promise(resolve => setTimeout(resolve, 3000));
  clearInterval(spinner);
  process.stdout.write('\r' + colors.green + '✓ Analysis complete!      \n\n' + colors.reset);
  
  // Display AI analysis
  console.log(colors.bold + colors.blue + '┌─────────────────────────────────────────────────────┐');
  console.log('│                 AI ANALYSIS RESULTS                │');
  console.log('└─────────────────────────────────────────────────────┘' + colors.reset + '\n');
  
  await typeWriter('Threat Pattern Identified: SSH Brute Force Attack', 10, colors.red + colors.bold);
  console.log('\n');
  
  console.log(colors.white + colors.bold + 'Analysis Summary:' + colors.reset);
  await typeWriter('The log entries show a pattern consistent with an SSH brute force attack against server-01.', 5);
  await typeWriter('The attacker is attempting to gain unauthorized access by trying multiple passwords.', 5);
  console.log('\n');
  
  console.log(colors.white + colors.bold + 'Evidence:' + colors.reset);
  await typeWriter('• 8 failed login attempts within 22 seconds', 5, colors.yellow);
  await typeWriter('• All attempts originate from the same IP address (192.168.1.100)', 5, colors.yellow);
  await typeWriter('• Targeting common usernames (root, admin)', 5, colors.yellow);
  await typeWriter('• Sequential port usage indicating automated tool', 5, colors.yellow);
  console.log('\n');
  
  console.log(colors.white + colors.bold + 'Threat Metrics:' + colors.reset);
  await typeWriter('• Confidence: 98.7%', 5, colors.magenta);
  await typeWriter('• Severity: HIGH', 5, colors.red);
  await typeWriter('• MITRE ATT&CK Mapping: T1110.001 (Password Guessing)', 5, colors.magenta);
  console.log('\n');
  
  console.log(colors.white + colors.bold + 'Recommended Response:' + colors.reset);
  await typeWriter('1. Block source IP address (192.168.1.100) at firewall', 5, colors.green);
  await typeWriter('2. Check if any login attempts succeeded', 5, colors.green);
  await typeWriter('3. Verify SSH configuration (disable root login, use key authentication)', 5, colors.green);
  await typeWriter('4. Implement IP rate limiting', 5, colors.green);
  console.log('\n');
  
  // Generate JSON alert
  await typeWriter('Generating JSON alert for system...', 10, colors.cyan);
  
  console.log('\n' + colors.yellow + 'Alert JSON:' + colors.reset);
  const alertJson = {
    type: "ai_alert",
    timestamp: new Date().toISOString(),
    source: "groq-llm-analyzer",
    confidence: 0.987,
    threat: {
      name: "SSH Brute Force Attack",
      severity: "high",
      technique: "T1110.001",
      source_ip: "192.168.1.100",
      target: "server-01",
      evidence: "8 failed login attempts in 22 seconds",
    },
    suggested_actions: [
      "block_ip:192.168.1.100",
      "check_successful_logins",
      "harden_ssh_config",
      "implement_rate_limiting"
    ]
  };
  
  console.log(JSON.stringify(alertJson, null, 2));
  console.log('\n');
  
  await typeWriter('Alert sent to incident response system.', 10, colors.green);
  
  // Ask user if they want to see the full demo
  console.log('\n');
  rl.question(colors.cyan + 'Run full incident response demo? (y/n): ' + colors.reset, async (answer) => {
    if (answer.toLowerCase() === 'y') {
      console.log('\nLaunching incident response demo...\n');
      rl.close();
      
      // Run the main demo script
      const { spawn } = require('child_process');
      const demo = spawn('node', ['demo-attack.js'], { stdio: 'inherit' });
      
      demo.on('close', (code) => {
        process.exit(0);
      });
    } else {
      console.log('\n' + colors.gray + 'Demo complete. Exiting...' + colors.reset);
      rl.close();
    }
  });
}

// Start the simulation
simulateLLMAnalysis();

// Handle exit
rl.on('close', () => {
  console.log(colors.reset);  // Reset colors
}); 