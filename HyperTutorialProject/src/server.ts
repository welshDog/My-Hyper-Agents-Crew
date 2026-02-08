
import Fastify from 'fastify';
import pino from 'pino';
import { db, initDB } from './db/index.js';
import { agents, workflows } from './db/schema.js';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { BroskiOrchestratorService } from './services/orchestrator.service.js';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

const server = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

// Setup Zod Validator
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

// Register Swagger
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'HyperTutorialProject API',
      description: 'API for Broski Agents Orchestration',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  transform: jsonSchemaTransform,
});

server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

const orchestratorService = new BroskiOrchestratorService();

// Validation Schema for POST /workflows
const WorkflowSchema = z.object({
  userId: z.string().uuid(),
  prompt: z.string().min(1).max(10000),
  options: z.object({
    timeout: z.number().optional().default(30000),
    retryLimit: z.number().optional().default(3),
  }).optional(),
});

const WorkflowResponseSchema = z.object({
    workflowId: z.number(),
    status: z.string(),
    createdAt: z.string()
});

const WorkflowStatusSchema = z.object({
    workflowId: z.number(),
    status: z.string(),
    userRequest: z.string(),
    createdAt: z.string().nullable()
});

// Root route
server.get('/', async (request, reply) => {
  return { hello: 'world', system: 'HyperTutorialProject API' };
});

// Health check
server.get('/health', async (request, reply) => {
  return { status: 'ok', uptime: process.uptime() };
});

// Agents endpoint (Test DB connection)
server.get('/agents', async (request, reply) => {
  const result = await db.select().from(agents).all();
  return { agents: result };
});

// Create Workflow Endpoint
server.post('/workflows', {
    schema: {
        body: WorkflowSchema,
        response: {
            201: WorkflowResponseSchema
        }
    }
}, async (request, reply) => {
  const body = request.body as z.infer<typeof WorkflowSchema>; // Explicitly typed because we use the zod provider
    
  // Create workflow
  const workflowId = await orchestratorService.createWorkflow(body.prompt);
    
  // Trigger async execution (Fire and forget)
  orchestratorService.executeWorkflow(workflowId).catch(err => {
      request.log.error(err, 'Async workflow execution failed');
  });

  reply.code(201).send({
    workflowId,
    status: 'queued',
    createdAt: new Date().toISOString()
  });
});

// Get Workflow Status Endpoint
server.get('/workflows/:id', {
    schema: {
        params: z.object({ id: z.string() }),
        response: {
            200: WorkflowStatusSchema,
            404: z.object({ error: z.string() }),
            400: z.object({ error: z.string() })
        }
    }
}, async (request, reply) => {
  const { id } = request.params as { id: string };
  const workflowId = parseInt(id); // Drizzle uses integers for IDs

  if (isNaN(workflowId)) {
      return reply.code(400).send({ error: 'Invalid ID format' });
  }

  const workflow = await orchestratorService.getWorkflow(workflowId);

  if (!workflow) {
    return reply.code(404).send({ error: 'Workflow not found' });
  }

  return {
    workflowId: workflow.id,
    status: workflow.status,
    userRequest: workflow.userRequest,
    createdAt: workflow.createdAt
  };
});

const start = async () => {
  try {
    initDB();
    await server.listen({ port: 3000, host: '0.0.0.0' });
    server.log.info(`Server running at http://localhost:3000`);
    server.log.info(`Swagger docs available at http://localhost:3000/docs`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
