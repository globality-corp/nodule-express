import auth from 'basic-auth';
import { getConfig, getContainer, bind } from '@globality/nodule-config';


export default function basicAuth(req, res, next) {
    const { unauthorized } = getContainer('routes');
    const { password, username } = getConfig('credentials');

    const credentials = auth(req);

    if (credentials &&
        credentials.name === username &&
        credentials.pass === password) {
        return next();
    }

    return unauthorized(req, res);
}

bind('middleware.basicAuth', () => basicAuth);
