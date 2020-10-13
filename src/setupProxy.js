const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    proxy({
      target: 'http://localhost:8080',
      xfwd: false, //backend will redirect when these are present.
      changeOrigin: true,
      pathRewrite: {'^/api/': '/'}
    })
  );
};
