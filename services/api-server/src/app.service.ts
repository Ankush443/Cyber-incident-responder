import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  listPlaybooks() {
    return this.prisma.playbook.findMany();
  }

  async executePlaybook(name: string) {
    const pb = await this.prisma.playbook.findUnique({ where: { name } });
    // TODO: dispatch commands to agent
    return { status: 'dispatched', playbook: pb };
  }
} 