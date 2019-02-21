import { bind, getContainer } from '@globality/nodule-config';
import { OK } from 'http-status-codes';


export default function configRoute(req, res) {
    const { declassifiedConfig } = getContainer();

    return res.status(OK).json(declassifiedConfig);
}

bind('routes.config', () => configRoute);
