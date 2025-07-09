/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ✅ Enable static export
  distDir: 'out',   // Optional: change build output folder (default is `.next`)
};

module.exports = nextConfig;
