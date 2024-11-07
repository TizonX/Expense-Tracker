/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const nextConfig = withPWA({
  dest: 'public', // Destination for the generated service worker and PWA assets
  disable: process.env.NODE_ENV === 'development', // Disable in development
  // Additional PWA options (optional)
});

export default nextConfig;
