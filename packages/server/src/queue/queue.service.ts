// src/queue/queue.service.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { DB_QUEUE } from './constants';

@Injectable()
export class QueueService {
  constructor(@InjectQueue(DB_QUEUE) private queue: Queue) {}

  async addJob(data: any) {
    return this.queue.add('process-job', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }

  async getJobStatus(jobId: string) {
    const job = await this.queue.getJob(jobId);
    if (!job) {
      return { status: 'not_found' };
    }
    return {
      id: job.id,
      status: await job.getState(),
      data: job.data,
    };
  }
}
