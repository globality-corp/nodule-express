import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import requestId from 'connect-requestid';

import { bind, getContainer, setDefaults } from '@globality/nodule-config';

function getCORSOrigin () {
    const { config } = getContainer();
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
});

function createExpress() {
    const corsOptions = {
        credentials: true,
        maxAge: 86400,
    };
    const corsOrigin = getCORSOrigin();

    if (corsOrigin !== null) {
        corsOptions.origin = corsOrigin;
    }

    const app = express();
    app.use(cors(corsOptions));
    app.use(helmet());
    app.use(requestId);

    return app;
}


bind('routes.express', () => createExpress());
