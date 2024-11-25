// next.config.js
export default {
    experimental: {
      middleware: true,
    },
    images: {
      domains: ['devapi.sueennature.com'], // Add your external domain here
    },
    env: {
      BE_URL: process.env.BE_URL,
      X_API_KEY: process.env.X_API_KEY,
    },
  };
  