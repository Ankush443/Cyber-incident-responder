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

// Input alert data from Groq analysis
const alertData = {
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

// Simulate ScreenPipe TypeScript transformer for converting alerts to actionable responses
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

async function simulateTransformer() {
  console.clear();
  
  // Display title
  console.log('\n' + colors.bold + colors.blue + '┌─────────────────────────────────────────────────────┐');
  console.log('│           SCREENPIPE TRANSFORMER DEMO             │');
  console.log('└─────────────────────────────────────────────────────┘' + colors.reset + '\n');
  
  await typeWriter('🔍 Starting ScreenPipe transformer service...', 10, colors.cyan);
  console.log('\n');
  
  // Display incoming alert
  console.log(colors.yellow + 'Incoming Alert Data:' + colors.reset);
  console.log(JSON.stringify(alertData, null, 2));
  console.log('\n');
  
  await typeWriter('⚙️ Processing alert through transformer pipeline...', 15, colors.cyan);
  
  // Simulate processing with spinner
  process.stdout.write(colors.cyan);
  const spinChars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  const spinner = setInterval(() => {
    process.stdout.write(`\rTransforming data ${spinChars[i]} `);
    i = (i + 1) % spinChars.length;
  }, 80);
  
  // Wait for "transformation" to complete
  await new Promise(resolve => setTimeout(resolve, 2000));
  clearInterval(spinner);
  process.stdout.write('\r' + colors.green + '✓ Transformation complete!      \n\n' + colors.reset);
  
  // Display code snippet showing transformation
  console.log(colors.white + colors.bold + 'Transformer Code:' + colors.reset);
  console.log(colors.gray + '// ScreenPipe TypeScript transformer');
  console.log('export default function transform(input: AlertData): ActionPlan {');
  console.log('  // Match threat pattern to playbook template');
  console.log('  const playbook = selectPlaybook(input.threat.name);');
  console.log('');
  console.log('  // Replace variables in playbook commands');
  console.log('  const actionPlan = {');
  console.log('    alertId: generateId(),');
  console.log('    playbook: playbook.name,');
  console.log('    steps: playbook.steps.map(step => ({');
  console.log('      ...step,');
  console.log('      command: replaceVariables(step.command, input)');
  console.log('    }))');
  console.log('  };');
  console.log('');
  console.log('  return actionPlan;');
  console.log('}' + colors.reset);
  console.log('\n');
  
  // Display action plan
  const actionPlan = {
    id: "INC-" + Date.now().toString().slice(-6),
    alert_source: alertData.source,
    playbook: "SSH_BRUTE_FORCE",
    target: alertData.threat.target,
    created_at: new Date().toISOString(),
    severity: alertData.threat.severity.toUpperCase(),
    status: "READY",
    steps: playbooks.SSH_BRUTE_FORCE.steps.map(step => ({
      ...step,
      command: step.command
        .replace(/{source_ip}/g, alertData.threat.source_ip)
        .replace(/{target}/g, alertData.threat.target),
      status: "PENDING"
    }))
  };
  
  await typeWriter('📋 Generated Action Plan:', 10, colors.green + colors.bold);
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
  
  await typeWriter('🚀 Sending action plan to execution engine...', 10, colors.cyan);
  console.log('\n');
  
  // Simulate security check
  console.log(colors.white + colors.bold + 'Security Verification:' + colors.reset);
  await typeWriter('Verifying digital signature...', 5, colors.yellow);
  await typeWriter('Checking authorization level...', 5, colors.yellow);
  await typeWriter('Validating command safety...', 5, colors.yellow);
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(colors.green + '✓ Security checks passed!' + colors.reset);
  console.log('\n');
  
  await typeWriter('📤 Action plan delivered to agent on server-01', 10, colors.green);
  
  // Ask user if they want to see the full demo
  console.log('\n');
  rl.question(colors.cyan + 'Run incident response demo with execution? (y/n): ' + colors.reset, async (answer) => {
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
simulateTransformer();

// Handle exit
rl.on('close', () => {
  console.log(colors.reset);  // Reset colors
}); 