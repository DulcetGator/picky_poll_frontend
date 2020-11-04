const proxy = require('http-proxy-middleware');

const backend = process.env.BACKEND_ENV === 'prod'
  ? 'https://api.pickypoll.com/'
  : 'http://localhost:8080/'


module.exports = function(app) {
  app.use(
    '/api',
    proxy({
      target: 'http://localhost:8080/',
      xfwd: false, //backend will redirect when these are present.
      changeOrigin: true,
      pathRewrite: {'^/api/': '/'}
    })
  );
};
