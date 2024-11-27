const path = require('path');
const fs = require('fs');
const ignoredFiles = require('react-dev-utils/ignoredFiles'); // Import ignoredFiles
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware');
const getHttpsConfig = require('./getHttpsConfig');

// Manually define paths and variables
const sockHost = process.env.WDS_SOCKET_HOST || 'localhost';  // Default to 'localhost'
const sockPath = process.env.WDS_SOCKET_PATH || '/ws';  // Default to '/ws'
const sockPort = process.env.WDS_SOCKET_PORT || 3000;  // Default to 3000




// Manually define paths
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const paths = {
  appPublic: resolveApp('public'),
  appSrc: resolveApp('src'),
  publicUrlOrPath: '/'
};

module.exports = function (proxy, allowedHost) {
  const disableFirewall =
    !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true';

  return {
    allowedHosts: disableFirewall ? 'all' : [allowedHost],
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
    },
    compress: true,
    static: {
      directory: paths.appPublic,
      publicPath: [paths.publicUrlOrPath],
      watch: {
        ignored: ignoredFiles(paths.appSrc),
      },
    },
    client: {
      webSocketURL: {
        hostname: sockHost,
        pathname: sockPath,
        port: sockPort,
      },
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    devMiddleware: {
      publicPath: paths.publicUrlOrPath.slice(0, -1),
    },
    host: 'boborange.in',
    port: 3000,
    historyApiFallback: {
      disableDotRule: true,
      index: paths.publicUrlOrPath,  // Make sure this is set to '/'
    },
    // Corrected proxy configuration (proxy as an object)
    proxy: [
      {
        context: ['/api/v1/users'],  // Match the specific API endpoint
        target: 'http://localhost:8000',  // Proxy to local backend
        changeOrigin: true,
        pathRewrite: {
          '^/api/v1/users': '/api/v1/users/',  // Path rewriting rule
        },
        secure: false,
      },
      {
        context: ['/api/v1/biharpayment'],  // Match the specific API endpoint
        target: 'http://1.6.61.79',  // Proxy to local backend
        changeOrigin: true,
        pathRewrite: {
          '^/api/v1/biharpayment': '',  // Path rewriting rule
        },
        secure: false,
      },
      {
        context: ['/api/v1/hargharbijli'],  // Match the specific API endpoint
        target: 'http://hargharbijli.bsphcl.co.in',  // Proxy to local backend
        changeOrigin: true,
        pathRewrite: {
          '^/api/v1/hargharbijli': '',  // Path rewriting rule
        },
        secure: false,
      },
    ],
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app.use(evalSourceMapMiddleware(devServer));

      if (fs.existsSync(paths.proxySetup)) {
        require(paths.proxySetup)(devServer.app);
      }

      devServer.app.use(redirectServedPath(paths.publicUrlOrPath));
      devServer.app.use(noopServiceWorkerMiddleware(paths.publicUrlOrPath));

      return middlewares;
    },
  };
};
