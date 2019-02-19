import { bind, getContainer } from '@globality/nodule-config';
import { OK } from 'http-status-codes';
import { cloneDeep, has, set } from 'lodash';

export default function configRoute(req, res) {
    const { config } = getContainer();

    if (!has(config, 'secrets')) {
        return res.status(OK).json('Config sharing disabled if no secrets are labeled');
    }

    // Set any fields that are secrets to undefined
    const clonedConfig = cloneDeep(config);
    clonedConfig.secrets.forEach((secret) => {
        if (has(clonedConfig, secret)) {
            set(clonedConfig, secret, undefined);
        }
    });

    // Also hide the list of secrets
    set(clonedConfig, 'secrets', undefined);

    return res.status(OK).json(clonedConfig);
}

bind('routes.config', () => configRoute);
