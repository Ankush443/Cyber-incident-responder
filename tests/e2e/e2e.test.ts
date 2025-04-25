import Fluvio from '@fluvio/client';
import WebSocket from 'ws';

jest.setTimeout(30000);

test('SSH brute-force triggers high severity and isolate-iface', async () => {
  const fluvio = await Fluvio.connect();
  const raw = fluvio.topicProducer('raw-logs');
  const alertCons = fluvio.partitionConsumer('alerts', 0);
  const metricCons = fluvio.partitionConsumer('metrics', 0);

  // produce brute-force logs
  for (let i = 0; i < 20; i++) {
    await raw.send(0, `Failed password for invalid user root from 1.2.3.4 port ${1000 + i}`);
  }

  let highAlert: any = null;
  const alertStream = alertCons.stream();
  for await (const rec of alertStream) {
    const msg = JSON.parse(rec.value.toString());
    if (msg.payload.severity === 'high') {
      highAlert = msg;
      break;
    }
  }
  expect(highAlert).not.toBeNull();

  // connect agent WS
  const ws = new WebSocket('ws://localhost:3000/ws');
  ws.on('open', () => {
    ws.send(JSON.stringify({ action: 'isolate-iface', id: highAlert.id }));
  });

  const metricStream = metricCons.stream();
  let success = false;
  for await (const rec of metricStream) {
    const m = JSON.parse(rec.value.toString());
    if (m.command_id === highAlert.id && m.status === 'success') {
      success = true;
      break;
    }
  }
  expect(success).toBe(true);
}); 