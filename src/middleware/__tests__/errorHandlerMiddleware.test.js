import { clearBinding, getContainer, Nodule } from '@globality/nodule-config';
import request from 'supertest';
import '../../index.js';
import { DEFAULT_ERROR_MESSAGE } from '../error-handler/index.js';

const ERROR_ENDPOINT = '/api/error';
const ERROR_MESSAGE = 'Sample error';

const runTestApplication = async (environment, hideErrorDetails = true) => {
    await Nodule.testing().fromObject({
        logger: {
            loggly: {
                environment,
            },
            hideErrorDetails,
        },
    }).load();
    const { express } = getContainer('routes');
    const { errorHandler } = getContainer('middleware');

    express.get(ERROR_ENDPOINT, (_req, _res, next) => {
        next(new Error(ERROR_MESSAGE));
    });
    express.use(errorHandler);

    return express;
};

describe('Error handler middleware', () => {
    beforeEach(() => {
        clearBinding('config');
    });

    it('by default should hide errors', async () => {
        await Nodule.testing().fromObject({
            logger: {
                loggly: {
                    environment: 'other-prod',
                },
            },
        }).load();
        const { express } = getContainer('routes');
        const { errorHandler } = getContainer('middleware');

        express.get(ERROR_ENDPOINT, (_req, _res, next) => {
            next(new Error(ERROR_MESSAGE));
        });
        express.use(errorHandler);
        const response = await request(express).get(
            ERROR_ENDPOINT,
        );

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toEqual(DEFAULT_ERROR_MESSAGE);
        expect(response.body.status).toEqual(500);
        expect(response.body.stack).toEqual(undefined);
    });

    it('doesn\'t show error details inside prod', async () => {
        const express = await runTestApplication('prod');
        const response = await request(express).get(
            ERROR_ENDPOINT,
        );

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toEqual(DEFAULT_ERROR_MESSAGE);
        expect(response.body.status).toEqual(500);
        expect(response.body.stack).toEqual(undefined);
    });

    it('doesn\'t show error details inside demo', async () => {
        const express = await runTestApplication('demo');
        const response = await request(express).get(
            ERROR_ENDPOINT,
        );

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toEqual(DEFAULT_ERROR_MESSAGE);
        expect(response.body.status).toEqual(500);
        expect(response.body.stack).toEqual(undefined);
    });

    it('shows error details inside dev', async () => {
        const express = await runTestApplication('dev', false);
        const response = await request(express).get(
            ERROR_ENDPOINT,
        );

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toEqual(ERROR_MESSAGE);
        expect(response.body.status).toEqual(500);
        expect(response.body.stack).not.toEqual(undefined);
    });

    it('shows error details inside test', async () => {
        const express = await runTestApplication('test', false);
        const response = await request(express).get(
            ERROR_ENDPOINT,
        );

        expect(response.statusCode).toBe(500);
        expect(response.body.message).toEqual(ERROR_MESSAGE);
        expect(response.body.status).toEqual(500);
        expect(response.body.stack).not.toEqual(undefined);
    });
});
