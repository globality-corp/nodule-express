import { pathToRegexp } from 'path-to-regexp';

/**
 * Will only execute provided middleware if current request path is not included in a
 * given list of express paths.
 * @param {string|string[]} paths string or list of strings that defines express paths where
 * given middleware won't be executed. It is also possible to provide regular expressions.
 * @param {(req: any, res: any, next: any) => any} middlewareFn
 * Middleware function to be executed if current path does not match `paths` param.
 * @returns Middleware function
 */
export default function except(paths, middlewareFn) {
    const regexp = paths ? pathToRegexp(paths) : null;
    return (req, res, next) => {
        if (regexp && regexp.test(req.path)) return next();
        return middlewareFn(req, res, next);
    };
}
