import { processGenerationJob } from './worker';

export function enqueueJob(job: { id?: string; type: string; payload: any }) {
  if (process.env.USE_QUEUE === 'true') {
    // TODO: push to queue system (Redis/BullMQ/RabbitMQ)
    // placeholder: directly process
    return processGenerationJob({ id: job.id || 'local', type: job.type, payload: job.payload });
  }
  // If queue not enabled, run synchronously
  return processGenerationJob({ id: job.id || 'local-sync', type: job.type, payload: job.payload });
}
