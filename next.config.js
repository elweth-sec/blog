/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ignorer les routes d'API lors de l'export statique
  experimental: {
    excludeDefaultRoutes: ['/api/content', '/api/tree']
  }
};

module.exports = nextConfig;