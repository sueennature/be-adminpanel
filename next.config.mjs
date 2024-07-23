export const env = {
    BE_URL: process.env.BE_URL,
    X_API_KEY : process.env.X_API_KEY
};

export const nextConfig = {
    // Other Next.js configurations
    experimental: {
        middleware: true,
    },
};