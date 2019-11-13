const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    proxy({
      target: 'https://api.pickypoll.com',
      xfwd: false, //backend will redirect when these are present.
      changeOrigin: true,
      pathRewrite: {'^/api/': '/'}
    })
  );
};
