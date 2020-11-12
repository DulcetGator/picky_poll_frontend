// eslint-disable-next-line import/no-extraneous-dependencies
const proxy = require('http-proxy-middleware');

const isProd = process.env.BACKEND_ENV === 'prod';
const backend = isProd
  ? 'https://pickypoll.com/api/'
  : 'http://localhost:8080/';

const pathRewriteTarget = isProd
  ? '/api/'
  : '/';

// eslint-disable-next-line func-names
module.exports = function (app) {
  app.use(
    '/api',
    proxy({
      target: backend,
      xfwd: false, // backend will redirect when these are present.
      changeOrigin: true,
      pathRewrite: { '^/api/': pathRewriteTarget },
    }),
  );
};
