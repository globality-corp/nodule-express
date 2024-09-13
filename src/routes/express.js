import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import requestId from 'connect-requestid';

import { bind, getContainer, setDefaults } from '@globality/nodule-config';

import except from '../utils/except';

export function getCORSOrigin(config) {
    const { reflectOrigin, allowedOrigins } = config.cors;

    if (reflectOrigin) {
        return true;
    }

    if (allowedOrigins) {
        return (origin, callback) => {
            if (allowedOrigins.split(',').indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        };
    }

    return null;
}

setDefaults('cors', {
    allowedOrigins: '',
    reflectOrigin: false,
    excludedPaths: null,
});

export function createExpress() {
    const { config } = getContainer();

    const corsOptions = {
        credentials: true,
        maxAge: 86400,
    };

    const corsOrigin = getCORSOrigin(config);

    if (corsOrigin !== null) {
        corsOptions.origin = corsOrigin;
        corsOptions.exposedHeaders = ['X-Request-Id', 'X-Response-Time'];
    }

    const app = express();
    app.use(except(config.cors.excludedPaths || null, cors(corsOptions)));
    app.use(helmet());
    app.use(requestId);

    return app;
}


bind('routes.express', () => createExpress());
