import { clearBinding, getContainer, Nodule } from '@globality/nodule-config';
import 'index';
import request from 'supertest';

describe('API: CORS configuration', () => {
    beforeEach(() => {
        clearBinding('config');
    });

    it('will handle reflect origin configuration', async () => {
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
        expect(res.header['access-control-allow-origin']).toEqual('http://foobar.com');
        expect(res.header['access-control-allow-credentials']).toEqual('true');
    });

});
