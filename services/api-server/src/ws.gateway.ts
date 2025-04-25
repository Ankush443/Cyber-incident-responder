import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'ws';
import Fluvio, { Offset } from '@fluvio/client';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class WsGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;
  private logger = new Logger('WsGateway');

  afterInit() {
    this.logger.log('WebSocket Gateway initialized');
    this.connectToFluvio();
  }

  async connectToFluvio() {
    try {
      // Create a new Fluvio instance and connect to it
      const fluvio = await Fluvio.connect();
      
      this.logger.log('Connected to Fluvio');
      
      // Create a consumer for the 'alerts' topic
      const consumer = await fluvio.partitionConsumer("alerts", 0);
      
      this.logger.log('Started consuming from alerts topic');
      
      // Set up a callback to handle incoming records
      await consumer.stream(Offset.FromEnd(), async (record) => {
        try {
          const message = record.valueString();
          this.logger.log(`Received alert: ${message}`);
          
          // Broadcast the message to all connected clients
          this.server.clients.forEach(client => {
            if (client.readyState === 1) { // WebSocket.OPEN
              client.send(message);
            }
          });
        } catch (error: any) {
          this.logger.error(`Error processing message: ${error.message}`);
        }
      });
    } catch (error: any) {
      this.logger.error(`Failed to connect to Fluvio: ${error.message}`);
    }
  }
} 