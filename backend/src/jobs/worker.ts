// Simple worker scaffold. Replace with BullMQ or other queue integration when needed.
import { MockAdapter } from '../features/ai/mock-adapter';

export async function processGenerationJob(job: {
  id: string;
  type: string;
  payload: any;
}) {
  // Example worker logic: call AI adapter and persist results
  const adapter = new MockAdapter();
  if (job.type === 'summary') {
    const summary = await adapter.generateSummary(
      job.payload.text,
      job.payload.maxPoints || 5,
    );
    // TODO: persist summary
    return { summary };
  }
  return { ok: true };
}
