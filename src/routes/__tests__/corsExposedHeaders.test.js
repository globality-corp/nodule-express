import { clearBinding, getContainer, Nodule } from '@globality/nodule-config';
import '../../index.js';
import request from 'supertest';

describe('API: CORS configuration', () => {
    beforeEach(() => {
        clearBinding('config');
    });

    it('will add "access-control-expose-headers" in the response headers', async () => {
        await Nodule.testing().fromObject({
            cors: {
                reflectOrigin: true,
            },
        }).load();

        const { express } = getContainer('routes');
        express.get('/api/test', (_req, res) => {
            res.json({ test: true }).end();
        });

        const res = await request(express)
            .get('/api/test')
            .set('origin', 'http://foobar.com');

        expect(res.statusCode).toEqual(200);
        expect(res.body.test).toEqual(true);
        expect(res.header['access-control-expose-headers']).toEqual('X-Request-Id,X-Response-Time');
    });
});
