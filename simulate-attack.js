// Import the Fluvio client
const fluvioModule = require('@fluvio/client');
// Get the default export which should be the Fluvio class
const Fluvio = fluvioModule.default || fluvioModule;

async function simulateAttack() {
  try {
    console.log('Attempting to connect to Fluvio...');
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
    
    console.log('Connected to Fluvio, creating producer...');
    const producer = await fluvio.topicProducer("raw-logs");
    
    console.log('Starting to send SSH brute force attack messages...');
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

// Run the attack simulation
simulateAttack(); 