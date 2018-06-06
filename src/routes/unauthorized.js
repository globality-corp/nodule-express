import { UNAUTHORIZED } from 'http-status-codes';

import { bind } from '@globality/nodule-config';


export default function unauthorized(req, res) {
    return res.status(UNAUTHORIZED).set(
        'WWW-Authenticate', 'Basic realm="Salesforce"',
    ).json({
        code: UNAUTHORIZED,
        message: 'Unauthorized',
    }).end();
}


bind('routes.unauthorized', () => unauthorized);
