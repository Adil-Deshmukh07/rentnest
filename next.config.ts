import type { NextConfig } from 'next';
const config: NextConfig = { agentRules: false, serverExternalPackages: ['@prisma/adapter-better-sqlite3','better-sqlite3'], experimental: { serverActions: { bodySizeLimit: '12mb' } }, images: { remotePatterns: [{protocol:'https',hostname:'images.unsplash.com'}] } };
export default config;
