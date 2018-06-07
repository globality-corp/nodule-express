/* Invoke a route function safely, by handling errors.
 */
export default function safely(func) {
    return async (req, res, next) => {
        try {
            return await func(req, res, next);
        } catch (error) {
            // NB: handle StatusError
            if (error.code) {
                return res.status(error.code).json({
                    code: error.code,
                    message: error.message,
                }).end();
            }
            // unsupported
            return next(error);
        }
    };
}
