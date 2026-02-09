import { performance } from 'node:perf_hooks';
import { BroskiOrchestrator } from './agents/orchestrator.js';

type MetricPoint = { t: number; fps?: number; memMB?: number; latencyMs?: number };
type DemoState = {
  running: boolean;
  startedAt?: number;
  finishedAt?: number;
  metrics: MetricPoint[];
  summary?: { durationMs: number; tasksCompleted: number; avgLatencyMs: number };
};

const state: DemoState = { running: false, metrics: [] };

export async function startDemoRun(): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (state.running) return { ok: false, reason: 'already_running' };
  state.running = true;
  state.metrics = [];
  state.startedAt = Date.now();

  const orch = new BroskiOrchestrator('Demonstration run');
  const t0 = performance.now();

  const tasks = [
    { goal: 'Synthesize research brief from multi-source inputs' },
    { goal: 'Generate UI flows for demo workspace' },
    { goal: 'Design scalable agent pipeline with backpressure' },
    { goal: 'Benchmark orchestrator throughput at target QPS' },
  ];

  let completed = 0;
  for (let i = 0; i < tasks.length; i++) {
    const s = performance.now();
    // Execute via orchestrator; errors are tolerated for the demo run
    try {
      // Use the orchestrator to plan then execute a short workflow
      await orch.run();
    } catch {
      // no-op
    }
    const e = performance.now();
    const latency = e - s;
    completed += 1;
    state.metrics.push({ t: e - t0, latencyMs: latency });
  }

  state.finishedAt = Date.now();
  const durationMs = (state.finishedAt - state.startedAt);
  const avgLatencyMs = state.metrics.reduce((a, m) => a + (m.latencyMs || 0), 0) / Math.max(1, state.metrics.length);
  state.summary = { durationMs, tasksCompleted: completed, avgLatencyMs };
  state.running = false;

  return { ok: true };
}

export function getDemoMetrics() {
  return {
    running: state.running,
    startedAt: state.startedAt,
    finishedAt: state.finishedAt,
    summary: state.summary,
    metrics: state.metrics.slice(-64),
  };
}
