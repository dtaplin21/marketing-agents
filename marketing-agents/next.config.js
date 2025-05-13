/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  postcss: false,
  webpack: (config) => {
    // Remove postcss-loader from the CSS rule
    const rules = config.module.rules
      .find((rule) => typeof rule.oneOf === 'object')
      .oneOf.filter((rule) => Array.isArray(rule.use));

    rules.forEach((rule) => {
      rule.use = rule.use.filter((loader) => {
        return !loader.loader?.includes('postcss-loader');
      });
    });

    return config;
  }
};

module.exports = nextConfig; 