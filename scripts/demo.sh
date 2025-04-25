#!/usr/bin/env bash
set -e

echo "🚀 Starting stack..."
docker-compose up -d --build

echo "⏱ Waiting for services..."
sleep 10

echo "🐍 Simulating SSH brute-force attack..."
python3 - << 'EOF'
import time
from fluvio import Fluvio
fluvio = Fluvio.connect()
producer = fluvio.topic_producer("raw-logs")
for i in range(50):
    msg = f"Failed password for invalid user admin from 192.168.1.100 port {1000+i}"
    producer.send(0, msg.encode())
    time.sleep(0.2)
EOF

echo "🔗 Opening Electron UI..."
npm --prefix frontend run start 