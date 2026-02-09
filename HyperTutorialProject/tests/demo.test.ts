import { jest } from '@jest/globals';

jest.unstable_mockModule('ioredis', () => ({
  default: jest.fn().mockImplementation(() => { const ping = jest.fn() as any; ping.mockResolvedValue('PONG'); return { ping }; }),
  Redis: jest.fn().mockImplementation(() => { const ping = jest.fn() as any; ping.mockResolvedValue('PONG'); return { ping }; }),
}));

jest.unstable_mockModule('bullmq', () => ({
  Queue: jest.fn().mockImplementation(() => { const add = jest.fn() as any; add.mockResolvedValue({ id: 'job-1' }); return { add }; }),
  QueueEvents: jest.fn().mockImplementation(() => ({ on: jest.fn() })),
}));

const { buildServer } = await import('../src/server.js');

describe('Demo endpoints', () => {
  it('starts demo run and returns metrics', async () => {
    const server = await buildServer();
    const start = await server.inject({ method: 'POST', url: '/demo/run' });
    expect(start.statusCode).toBe(202);

    const metrics = await server.inject({ method: 'GET', url: '/demo/metrics' });
    expect(metrics.statusCode).toBe(200);
    const body = metrics.json();
    expect(body).toHaveProperty('summary');
    expect(body).toHaveProperty('metrics');
    await server.close();
  });
});
