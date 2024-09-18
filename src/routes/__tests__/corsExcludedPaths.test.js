import { clearBinding, getContainer, Nodule } from '@globality/nodule-config';
import '../../index.js';
import request from 'supertest';

describe('API: CORS configuration', () => {
    beforeEach(() => {
        clearBinding('config');
    });

    it('will handle excluded paths configuration', async () => {
        await Nodule.testing().fromObject({
            cors: {
                excludedPaths: ['/api/health'],
                allowedOrigins: 'https://foo.com',
            },
        }).load();

        const { express } = getContainer('routes');
        express.get('/api/test', (_req, res) => {
            res.json({ value: 'test' }).end();
        });

        express.get('/api/health', (_req, res) => {
            res.json({ value: 'health' }).end();
        });

        const errorResponse = await request(express)
            .get('/api/test')
            .set('origin', 'http://foobar.com');

        expect(errorResponse.statusCode).toEqual(500);

        const successResponse = await request(express)
            .get('/api/health')
            .set('origin', 'http://foobar.com');

        expect(successResponse.statusCode).toEqual(200);
        expect(successResponse.body.value).toEqual('health');
        expect(successResponse.header['access-control-allow-origin']).toBeUndefined();
    });

});
