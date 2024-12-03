import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DB_QUEUE } from './constants';

@Processor(DB_QUEUE)
export class QueueProcessor extends WorkerHost {
  async process(job: Job<any, any, string>): Promise<any> {
    console.log('processing queue: ', job);
  }

  @OnWorkerEvent('completed')
  onCompleted() {
    console.log('processing DONE');
  }
}
