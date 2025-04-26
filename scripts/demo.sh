#!/usr/bin/env bash
set -e

echo "🚀 Starting stack..."
docker-compose up -d --build

echo "⏱ Waiting for services..."
sleep 10

echo "🐍 Simulating SSH brute-force attack..."
node - << 'EOF'
// Import the entire module first
const fluvioModule = require('@fluvio/client');
// Get the default export which should be the Fluvio class
const Fluvio = fluvioModule.default || fluvioModule;

async function simulateAttack() {
  try {
    // Try static method first
    let fluvio;
    try {
      fluvio = await Fluvio.connect();
    } catch (e) {
      // If static method fails, try constructor pattern
      console.log("Static connect failed, trying constructor pattern");
      fluvio = new Fluvio();
      await fluvio.connect();
    }
    
    const producer = await fluvio.topicProducer("raw-logs");
    
    for (let i = 0; i < 50; i++) {
      const msg = `Failed password for invalid user admin from 192.168.1.100 port ${1000+i}`;
      await producer.send(0, msg);
      console.log(`Sent: ${msg}`);
      // Sleep for 200ms
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    console.log("Attack simulation complete");
    process.exit(0);
  } catch (error) {
    console.error("Error during attack simulation:", error);
    process.exit(1);
  }
}

simulateAttack();
EOF

echo "🔗 Opening Electron UI..."
npm --prefix frontend run start 