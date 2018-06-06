import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import requestId from 'connect-requestid';

import { bind } from '@globality/nodule-config';


function createExpress() {
    const app = express();
    app.use(cors({}));
    app.use(helmet());
    app.use(requestId);

    return app;
}


bind('routes.express', () => createExpress());
