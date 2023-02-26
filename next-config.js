const withTM = require('next-transpile-modules')([
]);


module.exports = withTM({
  swcMinify: false,
  trailingSlash: true, //automatically redirect without a trailing slash. this lets us use query params...
  env: {
    // HOST
  },
});

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })
// module.exports = withBundleAnalyzer({})
