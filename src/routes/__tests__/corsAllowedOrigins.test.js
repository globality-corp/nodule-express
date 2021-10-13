import { clearBinding, getContainer, Nodule } from '@globality/nodule-config';
import 'index';
import request from 'supertest';

describe('API: CORS configuration', () => {
    beforeEach(() => {
        clearBinding('config');
    });

    it('will handle allowed origins configuration', async () => {
        await Nodule.testing().fromObject({
            cors: {
                allowedOrigins: 'https://foo.com,https://bar.com',
            },
        }).load();

        const { express } = getContainer('routes');
        express.get('/api/test', (req, res) => {
            res.json({ test: true }).end();
        });

        const res1 = await request(express)
            .get('/api/test')
            .set('origin', 'https://foo.com');

        expect(res1.statusCode).toEqual(200);
        expect(res1.body.test).toEqual(true);
        expect(res1.header['access-control-allow-origin']).toEqual('https://foo.com');
        expect(res1.header['access-control-allow-credentials']).toEqual('true');

        const res2 = await request(express)
            .get('/api/test')
            .set('origin', 'https://bar.com');

        expect(res2.statusCode).toEqual(200);
        expect(res2.body.test).toEqual(true);
        expect(res2.header['access-control-allow-origin']).toEqual('https://bar.com');
        expect(res2.header['access-control-allow-credentials']).toEqual('true');

        const res3 = await request(express)
            .get('/api/test')
            .set('origin', 'http://baz.com');

        expect(res3.statusCode).toEqual(500);
    });

});
