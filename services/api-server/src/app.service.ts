import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaClient) {}

  listPlaybooks() {
    return this.prisma.playbook.findMany();
  }

  async executePlaybook(name: string) {
    const pb = await this.prisma.playbook.findUnique({ where: { name } });
    // TODO: dispatch commands to agent
    return { status: 'dispatched', playbook: pb };
  }
} 