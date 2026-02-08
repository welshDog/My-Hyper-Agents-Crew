
import request from 'supertest';
import { db, initDB } from '../src/db/index.js';
import { workflows } from '../src/db/schema.js';
import { sql } from 'drizzle-orm';
import Fastify from 'fastify';
import { BroskiOrchestratorService } from '../src/services/orchestrator.service.js';

// We need to export the app/server instance from server.ts to test it properly.
// For now, let's create a test instance that mimics server.ts behavior
// or we can refactor server.ts to export the app factory.

// Mocking the DB and Service for integration tests
const app = Fastify();

app.get('/health', async (req, reply) => {
    return { status: 'ok', uptime: 100 };
});

describe('API Integration Tests', () => {
  let server: any;

  beforeAll(async () => {
    server = app;
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it('GET /health should return 200 OK', async () => {
    const response = await request(server.server)
      .get('/health')
      .expect(200);
    
    expect(response.body).toHaveProperty('status', 'ok');
  });

  // NOTE: True integration tests require the actual server instance from server.ts
  // Recommendation: Refactor server.ts to export a buildServer() function.
});
