import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'ws';
import 'reflect-metadata';  // Required for decorators like @WebSocketServer
import Fluvio, { Offset } from '@fluvio/client';

@WebSocketGateway({ path: '/ws', cors: true })
export class WsGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  async afterInit() {
    const fluvio = await Fluvio.connect();
    const consumer = await fluvio.partitionConsumer('alerts', 0);
    
    // The stream method requires an Offset and a callback function
    await consumer.stream(Offset.FromBeginning(), async (record) => {
      const msg = record.valueString();
      this.server.clients.forEach((client) => {
        client.send(JSON.stringify({ type: 'alert', payload: JSON.parse(msg), timestamp: Date.now() }));
      });
    });
  }
} 