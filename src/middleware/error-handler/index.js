import { getConfig, getContainer, bind } from '@globality/nodule-config';

export const DEFAULT_ERROR_MESSAGE = 'Something went wrong';

// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
    const { logger } = getContainer();
    const environment = getConfig('logger.loggly.environment');
    const displayErrorDetails = !['prod', 'demo'].includes(environment);

    if (process.env.NODE_ENV !== 'test') {
        logger.warning(req, err.message, {
            error: err,
        });
    }

    const status = err.statusCode || 500;
    res.status(status).json({
        status,
        message: displayErrorDetails ? err.message : DEFAULT_ERROR_MESSAGE,
        stack: displayErrorDetails ? err.stack : undefined,
    });
}

bind('middleware.errorHandler', () => errorHandler);
