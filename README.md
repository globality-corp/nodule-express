# @globality/nodule-express

Node Express Conventions

`nodule-express` aims to define basic routes for Node Express gateways to focus on definiing
logic for actual API endpoints and leave basic error handling and express set up to this library

## Bindings

By importing `nodule-express`, the following bindings are made available.

### Middleware

 -  `middleware.basicAuth` injects a basic auth middleware
 -  `middleware.errorHandler` injects a middleware to show unhandled errors in JSON format. This middleware should be use at the end of the middleware's chain inside the express app.

### Routes

 -  `routes.express` returns an Express instance
 -  `routes.health` returns a microcosm-compatible health check endpoint
 -  `routes.notFound` return a 404-generating endpoint
 -  `routes.unauthorized` return a 401-generating endpoint

## Commands
* `install`: Install dependencies and save to yarn.lock file
* `lint`: Runs airbnb flavored eslint
* `build`: Runs tests and transpiles ES6 -> ES5
* `test`: Runs tests
* `test:watch`: Runs tests watching files changes

## Errors

Endpoints should throw errors when something fails. Within `nodule-express`, it is expected that:

 -  All errors define `code` that can be used by API consumers for error handling business logic
 -  Most errors will borrow from HTTP error codes (because they have well-known, useful semantics)
 -  Error codes should be visible to API consumers via `error.extensions`

## Local Development

Local development of `nodule-express` with other repos has a few common pitfalls related to the
usage of peer dependencies:

 -  `nodule-config` is a peer-dependency because various libraries act as plugins to it and it needs
    a single import of `bottlejs` to share plugin state

To work with `nodule-express` locally:

 0. Run `yarn build` within `nodule-express` to transpile the source.

 1. Change directories to your local repo that you want to test against `nodule-express`.

 2. Run `yarn add /path/to/nodule-express` to copy the transpiled source into your local repo.
    Do **NOT** use `yarn link`

 3. After running `yarn add`, remove (or move-of-the-way) the `nodule_modules` from **within**
    `nodule_modules/@globality/nodule-express/`
