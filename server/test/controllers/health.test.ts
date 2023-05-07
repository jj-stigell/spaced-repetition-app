import supertest from 'supertest';

import { app } from '../../src/app';
import { HttpCode } from '../../src/type';

const request: supertest.SuperTest<supertest.Test> = supertest(app);

describe('Test GET /health - health check', () => {
  it('should respond with 200 - ok when healthy', async () => {
    const res: supertest.Response = await request.get('/health');
    expect(res.body.errors).not.toBeDefined();
    expect(res.body.data).not.toBeDefined();
    expect(res.statusCode).toBe(HttpCode.Ok);
  });
});
