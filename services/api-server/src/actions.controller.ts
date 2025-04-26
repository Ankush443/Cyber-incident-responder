import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { WsGateway } from './ws.gateway';

@Controller('actions')
export class ActionsController {
  constructor(private readonly wsGateway: WsGateway) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async executeAction(@Body() body: { alert_id: string; action: string }) {
    const { alert_id, action } = body;
    
    // Create a command message
    const commandMessage = JSON.stringify({
      id: alert_id,
      action: action,
      payload: {},
      signature: "generated_signature" // In a real app, you would sign this properly
    });
    
    // Broadcast to all WebSocket clients
    this.wsGateway.broadcastMessage(commandMessage);
    
    // Return confirmation
    return { 
      status: 'dispatched', 
      message: `Action ${action} dispatched for alert ${alert_id}` 
    };
  }
} 