# Hyper Agents Demonstration Project

## Objective
Design and implement a first-of-its-kind, production-grade Hyper Agents system that showcases multi-agent orchestration, scalable execution, breakthrough performance, and an innovative developer UX.

## Architecture Summary
- Orchestration Core: BroskiOrchestrator coordinates specialist agents for planning and execution.
- Services: Fastify API exposes workflows, health, metrics, and demo endpoints.
- Queueing: Optional BullMQ integration for scalable background processing.
- Metrics: Prometheus-compatible metrics endpoint and in-process performance capture.
- Data: Drizzle ORM and SQLite for lightweight persistence of agents/workflows.

## Demo Flow
1. POST /demo/run triggers an orchestrated multi-task scenario (research, UI planning, pipeline design, benchmark).
2. GET /demo/metrics returns a live snapshot with duration, tasks completed, and latency metrics.
3. Swagger available under /docs for API exploration.

## UI/UX Principles
- Dyslexia-friendly documentation structure: TL;DR → bullets → detail.
- API-first with clear schemas (Zod) and Swagger for discoverability.
- Minimal yet expressive endpoints to start/observe demo runs.

## Performance & Scalability
- ESM TypeScript with ts-jest for fast iteration.
- Optional BullMQ path for horizontal scaling of workflows.
- Metrics designed for Prometheus scraping to support SLOs.

## Safety & Compliance
- No secrets committed; coverage and generated artifacts excluded via .gitignore.
- Clear separation of demo logic to avoid impacting production endpoints.

## How To Run
- Start: `pnpm dev` or `npm run dev` (depending on project scripts).
- Visit: `http://localhost:3000/docs` for Swagger; call `/demo/run` then `/demo/metrics`.

## Future Extensions
- Live command-center UI panel for demo metrics.
- Agent marketplace integration, dataset tools, and A/B benchmarking harness.
