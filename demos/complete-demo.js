#!/usr/bin/env node
const readline = require('readline');
const { spawn } = require('child_process');

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

// Helper to sleep/wait
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Type text with animation
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

// Run a command with a nice spinner
async function runWithSpinner(message, durationMs) {
  process.stdout.write(colors.cyan + message + ' ');
  
  const spinChars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  const spinner = setInterval(() => {
    process.stdout.write(`\r${colors.cyan}${message} ${spinChars[i]} `);
    i = (i + 1) % spinChars.length;
  }, 80);
  
  await sleep(durationMs);
  clearInterval(spinner);
  process.stdout.write('\r' + colors.green + '✓ ' + message + ' complete!' + colors.reset + '                       \n');
}

// Introduction to the project
async function showIntro() {
  console.clear();
  console.log('\n' + colors.bold + colors.blue + '┌─────────────────────────────────────────────────────────┐');
  console.log('│       CYBER INCIDENT RESPONDER COMPLETE DEMO         │');
  console.log('└─────────────────────────────────────────────────────────┘' + colors.reset + '\n');
  
  await typeWriter('Welcome to the Cyber Incident Responder Demo!', 20, colors.green + colors.bold);
  console.log('\n');
  
  console.log('This demo will showcase the complete workflow of our system:');
  console.log('');
  console.log(colors.yellow + '1. ' + colors.reset + 'Log Collection & Stream Processing (Fluvio)');
  console.log(colors.yellow + '2. ' + colors.reset + 'AI Analysis of Security Events (Groq)');
  console.log(colors.yellow + '3. ' + colors.reset + 'Transformer for Converting Analysis to Actions (ScreenPipe)');
  console.log(colors.yellow + '4. ' + colors.reset + 'Incident Response Actions (Agent)');
  console.log(colors.yellow + '5. ' + colors.reset + 'Interactive Dashboard (Frontend)');
  console.log('');
  
  await typeWriter('Press Enter to begin the demonstration...', 20, colors.cyan);
  
  return new Promise(resolve => {
    rl.question('', () => {
      resolve();
    });
  });
}

// Demonstrate Fluvio streaming
async function demoFluvio() {
  console.clear();
  console.log('\n' + colors.bold + colors.blue + '┌─────────────────────────────────────────────────────────┐');
  console.log('│       STEP 1: LOG COLLECTION & STREAM PROCESSING     │');
  console.log('└─────────────────────────────────────────────────────────┘' + colors.reset + '\n');
  
  await typeWriter('Fluvio is a high-performance streaming platform that collects logs', 10);
  await typeWriter('from various sources and processes them in real-time.', 10);
  console.log('\n');
  
  await runWithSpinner('Connecting to Fluvio streaming platform...', 1500);
  
  console.log('\n' + colors.yellow + 'Stream Processor Architecture:' + colors.reset);
  console.log(`
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Log Sources    │────>│  Fluvio Topics  │────>│  Consumers      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
  • System Logs           • raw-logs             • AI Processor
  • Application Logs      • alerts              • API Server
  • Network Logs          • metrics             • Dashboard
  • Security Events       • commands
`);
  
  console.log('\n' + colors.white + colors.bold + 'Demo: SSH Brute Force Attack Logs' + colors.reset);
  
  console.log('\nStreaming logs into Fluvio "raw-logs" topic:');
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
  
  for (let i = 0; i < sshLogs.length; i++) {
    console.log(colors.gray + sshLogs[i] + colors.reset);
    await sleep(300);
  }
  
  console.log('\n' + colors.green + '✓ Logs successfully streamed to Fluvio!' + colors.reset);
  
  console.log('\nPress Enter to continue to AI Analysis...');
  await new Promise(resolve => {
    rl.question('', () => {
      resolve();
    });
  });
}

// Demonstrate Groq AI analysis
async function demoGroq() {
  console.clear();
  console.log('\n' + colors.bold + colors.blue + '┌─────────────────────────────────────────────────────────┐');
  console.log('│       STEP 2: AI ANALYSIS OF SECURITY EVENTS         │');
  console.log('└─────────────────────────────────────────────────────────┘' + colors.reset + '\n');
  
  await typeWriter('Groq LLM analyzes log patterns to identify security threats', 10);
  await typeWriter('with high accuracy and minimal latency.', 10);
  console.log('\n');
  
  console.log(colors.yellow + 'AI Processor Code:' + colors.reset);
  console.log(colors.gray + `
async function processLogBatch(logs: string[]) {
  // Prepare the prompt for Groq
  const prompt = \`
    Analyze the following system logs and identify any security threats:
    
    \${logs.join('\\n')}
    
    If you detect a security threat, respond with a JSON object containing:
    1. The type of threat
    2. Confidence level (0-1)
    3. Severity (low, medium, high)
    4. Affected systems
    5. Source IPs
    6. Recommended actions
  \`;
  
  // Send to Groq LLM API
  const completion = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
    max_tokens: 1024,
  });
  
  return parseGroqResponse(completion.choices[0].message.content);
}
` + colors.reset);
  
  await runWithSpinner('Sending logs to Groq LLM API...', 2000);
  
  console.log('\n' + colors.white + colors.bold + 'Groq LLM Analysis:' + colors.reset);
  
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
  
  // Generate JSON alert
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
  
  console.log(colors.yellow + 'Generated Alert JSON:' + colors.reset);
  console.log(JSON.stringify(alertJson, null, 2));
  
  console.log('\n' + colors.green + '✓ AI analysis complete!' + colors.reset);
  
  console.log('\nPress Enter to continue to ScreenPipe Transformer...');
  await new Promise(resolve => {
    rl.question('', () => {
      resolve();
    });
  });
  
  return alertJson;
}

// Demonstrate ScreenPipe transformer
async function demoScreenPipe(alertJson) {
  console.clear();
  console.log('\n' + colors.bold + colors.blue + '┌─────────────────────────────────────────────────────────┐');
  console.log('│       STEP 3: SCREENPIPE TRANSFORMER                 │');
  console.log('└─────────────────────────────────────────────────────────┘' + colors.reset + '\n');
  
  await typeWriter('ScreenPipe transforms AI analysis into executable actions', 10);
  await typeWriter('by matching threats to playbook templates.', 10);
  console.log('\n');
  
  // Define playbook templates
  const playbooks = {
    "SSH_BRUTE_FORCE": {
      name: "SSH Brute Force Attack Response",
      description: "Respond to SSH brute force attacks against systems",
      steps: [
        {
          id: "block_ip",
          name: "Block Attacker IP",
          command: "iptables -A INPUT -s {source_ip} -j DROP",
          rollback: "iptables -D INPUT -s {source_ip} -j DROP"
        },
        {
          id: "check_logins",
          name: "Check for Successful Logins",
          command: "grep 'Accepted' /var/log/auth.log | grep {source_ip}"
        },
        {
          id: "notify_admin",
          name: "Send Admin Notification",
          command: "send-alert -l high -m 'SSH brute force attack from {source_ip} against {target}'"
        },
        {
          id: "update_fail2ban",
          name: "Update Fail2ban Configuration",
          command: "fail2ban-client set sshd bantime 86400"
        }
      ]
    }
  };
  
  await runWithSpinner('Processing alert through transformer pipeline...', 1500);
  
  console.log('\n' + colors.yellow + 'ScreenPipe Transformer Logic:' + colors.reset);
  console.log(colors.gray + `
// Match threat to playbook and generate executable actions
function transform(alert) {
  // Identify appropriate playbook based on threat type
  const playbookName = matchThreatToPlaybook(alert.threat.name);
  const playbook = playbooks[playbookName];
  
  // Create action plan with resolved variable placeholders
  return {
    id: generateUniqueId(),
    alert_id: alert.id,
    playbook: playbookName,
    target: alert.threat.target,
    severity: alert.threat.severity,
    steps: playbook.steps.map(step => ({
      ...step,
      command: replaceVariables(step.command, alert.threat)
    }))
  };
}
` + colors.reset);
  
  // Display action plan
  const actionPlan = {
    id: "INC-" + Date.now().toString().slice(-6),
    alert_source: alertJson.source,
    playbook: "SSH_BRUTE_FORCE",
    target: alertJson.threat.target,
    created_at: new Date().toISOString(),
    severity: alertJson.threat.severity.toUpperCase(),
    status: "READY",
    steps: playbooks.SSH_BRUTE_FORCE.steps.map(step => ({
      ...step,
      command: step.command
        .replace(/{source_ip}/g, alertJson.threat.source_ip)
        .replace(/{target}/g, alertJson.threat.target),
      status: "PENDING"
    }))
  };
  
  await typeWriter('Generated Action Plan:', 10, colors.green + colors.bold);
  console.log('\n');
  
  console.log(colors.white + colors.bold + 'Action Details:' + colors.reset);
  console.log(colors.cyan + `ID: ${actionPlan.id}`);
  console.log(colors.cyan + `Playbook: ${playbooks.SSH_BRUTE_FORCE.name}`);
  console.log(colors.cyan + `Target System: ${actionPlan.target}`);
  console.log(colors.cyan + `Severity: ${actionPlan.severity}`);
  console.log(colors.cyan + `Status: ${actionPlan.status}`);
  console.log('\n');
  
  console.log(colors.white + colors.bold + 'Executable Steps:' + colors.reset);
  for (let i = 0; i < actionPlan.steps.length; i++) {
    const step = actionPlan.steps[i];
    console.log(colors.yellow + `Step ${i+1}: ${step.name}`);
    console.log(colors.gray + `Command: ${step.command}`);
    if (step.rollback) {
      console.log(colors.gray + `Rollback: ${step.rollback}`);
    }
    console.log('');
  }
  
  console.log('\n' + colors.green + '✓ ScreenPipe transformation complete!' + colors.reset);
  
  console.log('\nPress Enter to continue to Incident Response...');
  await new Promise(resolve => {
    rl.question('', () => {
      resolve();
    });
  });
  
  return actionPlan;
}

// Demonstrate execution of response actions
async function demoExecution(actionPlan) {
  console.clear();
  console.log('\n' + colors.bold + colors.blue + '┌─────────────────────────────────────────────────────────┐');
  console.log('│       STEP 4: INCIDENT RESPONSE ACTIONS              │');
  console.log('└─────────────────────────────────────────────────────────┘' + colors.reset + '\n');
  
  await typeWriter('The system executes response actions to mitigate the threat', 10);
  await typeWriter('through secure, authorized commands on target systems.', 10);
  console.log('\n');
  
  console.log(colors.yellow + 'Incident Response Flow:' + colors.reset);
  console.log(`
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Action Plan    │────>│  Authorization  │────>│  Agent          │
└─────────────────┘     └─────────────────┘     └─────────────────┘
  • Commands             • JWT Validation       • Execute Commands
  • Parameters           • Permission Check     • Report Results
  • Target Systems       • Command Signing      • Rollback if needed
`);
  
  console.log('\n' + colors.white + colors.bold + `Executing Response Plan: ${actionPlan.id}` + colors.reset);
  
  await sleep(500);
  
  // Execute each step
  for (let i = 0; i < actionPlan.steps.length; i++) {
    const step = actionPlan.steps[i];
    console.log('\n' + colors.yellow + `Step ${i+1}: ${step.name}` + colors.reset);
    console.log(colors.gray + `Command: ${step.command}` + colors.reset);
    
    await runWithSpinner(`Executing ${step.name}...`, 1500);
    
    // Simulate command output
    let output = '';
    switch (i) {
      case 0: // Block IP
        output = 'IP 192.168.1.100 successfully blocked at firewall.';
        break;
      case 1: // Check logins
        output = 'No successful logins found from 192.168.1.100.';
        break;
      case 2: // Notify
        output = 'Alert notification sent to security team (security@example.com).';
        break;
      case 3: // Update fail2ban
        output = 'Fail2ban configuration updated. Ban time set to 86400 seconds (24 hours).';
        break;
    }
    
    console.log(colors.green + 'Output: ' + colors.reset + output);
    console.log(colors.green + 'Status: ' + colors.reset + 'SUCCESS');
    
    await sleep(500);
  }
  
  console.log('\n' + colors.green + colors.bold + '✓ All response actions completed successfully!' + colors.reset);
  console.log(colors.cyan + `Incident ${actionPlan.id} has been resolved.` + colors.reset);
  
  console.log('\nPress Enter to continue to Frontend Dashboard...');
  await new Promise(resolve => {
    rl.question('', () => {
      resolve();
    });
  });
}

// Demonstrate the frontend dashboard
async function demoFrontend() {
  console.clear();
  console.log('\n' + colors.bold + colors.blue + '┌─────────────────────────────────────────────────────────┐');
  console.log('│       STEP 5: INTERACTIVE DASHBOARD                  │');
  console.log('└─────────────────────────────────────────────────────────┘' + colors.reset + '\n');
  
  await typeWriter('The web-based dashboard provides real-time monitoring', 10);
  await typeWriter('and interactive incident response capabilities.', 10);
  console.log('\n');
  
  console.log(colors.yellow + 'Frontend Components:' + colors.reset);
  console.log(`
┌───────────────────────────────────────────────────────────────────┐
│ ┌─────────┐ Cyber Incident Responder                    👤 Admin  │
│ │   🛡️    │                                                       │
│ │         │ ┌─────────────────────────────────────────────────┐   │
│ │         │ │ Dashboard Overview                              │   │
│ │ Dashboard│ │                                                 │   │
│ │         │ │  Total Alerts: 3    High Severity: 1    Resolved: 1 │   │
│ │ Alerts   │ │                                                 │   │
│ │         │ └─────────────────────────────────────────────────┘   │
│ │ Logs     │                                                       │
│ │         │ ┌─────────────────────────────────────────────────┐   │
│ │ Console  │ │ Recent Alerts                                  │   │
│ │         │ │                                                 │   │
│ │ Settings │ │  🔴 SSH Brute Force Attack - server-01         │   │
│ │         │ │      Resolved • 5 minutes ago                   │   │
│ └─────────┘ │                                                 │   │
│             │  🟡 Suspicious File Download - workstation-15   │   │
│             │      Investigating • 2 hours ago                │   │
│             │                                                 │   │
│             │  🔵 Unusual Login Time - laptop-22              │   │
│             │      Resolved • 3 hours ago                     │   │
│             └─────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────┘
`);
  
  console.log('\n' + colors.white + colors.bold + 'Frontend Features:' + colors.reset);
  console.log('• Real-time alert notifications via WebSockets');
  console.log('• Interactive incident response workflows');
  console.log('• Comprehensive system logs and audit trail');
  console.log('• Customizable dashboard with metrics and visualizations');
  console.log('• Mobile-responsive design');
  
  console.log('\n' + colors.green + '✓ Frontend is accessible at: http://localhost:5173' + colors.reset);
  
  console.log('\nPress Enter to see the complete system architecture...');
  await new Promise(resolve => {
    rl.question('', () => {
      resolve();
    });
  });
}

// Show system architecture
async function showArchitecture() {
  console.clear();
  console.log('\n' + colors.bold + colors.blue + '┌─────────────────────────────────────────────────────────┐');
  console.log('│       COMPLETE SYSTEM ARCHITECTURE                   │');
  console.log('└─────────────────────────────────────────────────────────┘' + colors.reset + '\n');
  
  console.log(colors.yellow + 'End-to-End Workflow:' + colors.reset);
  
  console.log(`
  ┌───────────────┐   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
  │  Log Sources  │   │    Fluvio     │   │  AI Analysis  │   │  ScreenPipe   │   │    Agent      │
  │               │──>│  Stream Proc. │──>│    (Groq)     │──>│  Transformer  │──>│  Execution    │
  └───────────────┘   └───────────────┘   └───────────────┘   └───────────────┘   └───────────────┘
                                                │                                          │
                                                │                                          │
                                                ▼                                          ▼
                                       ┌───────────────┐                         ┌───────────────┐
                                       │  WebSocket    │◄────────────────────────┤   Metrics &   │
                                       │   Gateway     │                          │   Logging     │
                                       └───────────────┘                         └───────────────┘
                                                │
                                                │
                                                ▼
                                       ┌───────────────┐
                                       │  Dashboard    │
                                       │    (UI)       │
                                       └───────────────┘
`);
  
  console.log('\n' + colors.white + colors.bold + 'Technologies Used:' + colors.reset);
  console.log('• Fluvio: Real-time streaming platform for log ingestion');
  console.log('• Groq: High-performance LLM for AI analysis of security events');
  console.log('• ScreenPipe: Transformer framework for converting analysis to actions');
  console.log('• NestJS: Backend API and WebSocket gateway');
  console.log('• React: Frontend dashboard with real-time updates');
  console.log('• Rust: High-performance agent for executing response actions');
  
  console.log('\nPress Enter to finish the demo...');
  await new Promise(resolve => {
    rl.question('', () => {
      resolve();
    });
  });
}

// Run the complete demo
async function runCompleteDemos() {
  await showIntro();
  await demoFluvio();
  const alertJson = await demoGroq();
  const actionPlan = await demoScreenPipe(alertJson);
  await demoExecution(actionPlan);
  await demoFrontend();
  await showArchitecture();
  
  console.clear();
  console.log('\n' + colors.bold + colors.blue + '┌─────────────────────────────────────────────────────────┐');
  console.log('│                 DEMO COMPLETE                        │');
  console.log('└─────────────────────────────────────────────────────────┘' + colors.reset + '\n');
  
  await typeWriter('Thank you for watching the Cyber Incident Responder demo!', 20, colors.green + colors.bold);
  console.log('\n');
  
  console.log('Key takeaways:');
  console.log('• Real-time detection of security threats using AI');
  console.log('• Automated response actions that follow security best practices');
  console.log('• Complete audit trail for all security incidents');
  console.log('• Scalable architecture for enterprise environments');
  
  console.log('\n' + colors.yellow + 'How to run the live system:' + colors.reset);
  console.log('1. Install dependencies: npm install');
  console.log('2. Export Groq API key: export GROQ_API_KEY=your_key_here');
  console.log('3. Start the system: npm run dev');
  console.log('4. Access dashboard: http://localhost:5173');
  
  rl.close();
}

// Start the demo
runCompleteDemos(); 