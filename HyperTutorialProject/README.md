# HyperTutorialProject — Broski Orchestrator

## Architecture
Broski Orchestrator coordinates specialist agents (researcher, designer, coder, integrator) to execute workflows. An Async Engine using BullMQ + Redis provides robust, crash-resilient job processing with retries and metrics.

### Async Engine (BullMQ + Redis)
- Producer: API enqueues workflows to Redis ([queue.service.ts](file:///c:/Users/Lyndz/Downloads/My%20Hyper%20Agents%20Crew/HyperTutorialProject/src/services/queue.service.ts)).
- Consumer: Worker ([workflowWorker.ts](file:///c:/Users/Lyndz/Downloads/My%20Hyper%20Agents%20Crew/HyperTutorialProject/src/workers/workflowWorker.ts)) processes jobs and runs orchestration logic.
- Persistence: Redis 7.
- Reliability: Exponential backoff retries, DLQ-ready; Prometheus metrics at /metrics.

## Local Setup

1. **Prerequisites**:
   - Node.js >= 18
   - Docker (for Redis)

2. **Start Redis**:
   ```bash
   docker-compose -f docker-compose.redis.yml up -d
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Environment Variables**:
   Copy `.env.example` to `.env` and set required values (AppConfig requires DB user/pass for validation):
   ```env
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=broski_secret
   WORKFLOW_RETRY_ATTEMPTS=3
   WORKFLOW_RETRY_DELAY=2000
   WORKFLOW_FAILURE_WEBHOOK=https://example.com/webhook
   ```

5. **Start API Server**:
   ```bash
   # Run the server (ensure build is done or use tsx)
   npx tsx src/server.ts
   ```

6. **Start Worker**:
   ```bash
   npm run worker:start
   ```

## Migration
To migrate from legacy in-memory promises to BullMQ:
```bash
npm run migrate:to-bullmq
```

To rollback/use legacy mode, set `USE_BULLMQ=false` in `.env`.

## Troubleshooting
- **Redis Connection Failed**: Check if Docker container is running (`docker ps`). Ensure password matches `.env`.
- **Jobs Stuck**: Check Prometheus metrics at `/metrics`. Check `failed-workflow` queue in Redis.
- **Worker not processing**: Ensure `npm run worker:start` is running.

## API Documentation
Swagger UI available at `/docs`. Routes with Zod schemas are documented.

### POST /workflows
Returns 202 Accepted with Location header.

```json
{
  "workflowId": 123,
  "status": "queued",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Demo Endpoints
- POST /demo/run → Starts a short orchestrated demo run; returns 202 Accepted and sets Location: /demo/metrics. [server.ts](file:///c:/Users/Lyndz/Downloads/My%20Hyper%20Agents%20Crew/HyperTutorialProject/src/server.ts#L115-L124)
- GET /demo/metrics → Returns snapshot with summary and recent latency metrics. [server.ts](file:///c:/Users/Lyndz/Downloads/My%20Hyper%20Agents%20Crew/HyperTutorialProject/src/server.ts#L126-L129)

### Scripts
- npm run build → Build ESM outputs via tsup
- npm run typecheck → TypeScript strict type checking
- npm run lint → ESLint over source and tests
- npm run test / test:ci → Jest with ESM modules; CI runs in-band
- npm run worker:start → Start BullMQ worker
- npm run power-moves → Launch interactive CLI
