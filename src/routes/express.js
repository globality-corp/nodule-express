import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import requestId from 'connect-requestid';

import { bind, getContainer, setDefaults } from '@globality/nodule-config';

setDefaults('cors', {
    reflectOrigin: false,
});

function createExpress() {
    const { config } = getContainer();

    const corsOptions = {
        maxAge: 86400,
    };

    if (config.cors.reflectOrigin) {
        corsOptions.origin = true;
    }

    const app = express();
    app.use(cors(corsOptions));
    app.use(helmet());
    app.use(requestId);

    return app;
}


bind('routes.express', () => createExpress());
