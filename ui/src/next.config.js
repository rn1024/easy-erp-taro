/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'images.unsplash.com',
      'avatars.githubusercontent.com',
      'ui-avatars.com'
    ],
    formats: ['image/avif', 'image/webp'],
  },
  sassOptions: {
    includePaths: ['./styles', './components'],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 优化包体积
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    };

    return config;
  },
  // 启用严格模式
  reactStrictMode: true,
  // 启用SWC编译器
  swcMinify: true,
  // 性能优化
  compress: true,
  // 移动端优化
  poweredByHeader: false,
  // 安全头
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  // 重定向配置
  async redirects() {
    return [
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;