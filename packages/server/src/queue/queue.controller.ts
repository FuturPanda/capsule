// src/queue/queue.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post()
  async addToQueue(@Body() data: any) {
    const job = await this.queueService.addJob(data);
    return {
      jobId: job.id,
      status: 'queued',
    };
  }

  @Get(':jobId')
  async getJobStatus(@Param('jobId') jobId: string) {
    return this.queueService.getJobStatus(jobId);
  }
}
