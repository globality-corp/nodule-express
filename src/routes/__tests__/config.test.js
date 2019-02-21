import { clearBinding, getContainer, loadFromObject, Nodule } from '@globality/nodule-config';
import 'index';
import request from 'supertest';


describe('Basic API', () => {

    beforeEach(async () => {
        clearBinding('config');
        const nodule = Nodule.testing();
        await nodule.from(
            loadFromObject({
                foo: 'object',
            }),
            true,
        ).from(
            loadFromObject({
                bar: 'object',
            }),
        ).load();
    });

    it('returns config information', async () => {
        const { express, config } = getContainer('routes');
        express.get('/api/config', config);

        const response = await request(express).get(
            '/api/config',
        );

        expect(response.statusCode).toBe(200);
        expect(response.body).not.toHaveProperty(
            'foo', 'object',
        );
        expect(response.body).toHaveProperty(
            'bar', 'object',
        );
    });

});
