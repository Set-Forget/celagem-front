/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/management',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/jsonrpc',
        destination: `${process.env.NEXT_PUBLIC_ERP_URL}/jsonrpc`,
      },
      {
        source: '/erp/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_ERP_URL}/api/v1/:path*`,
      },
      {
        source: '/hc/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_HC_URL}/api/v1/:path*`,
      },
      {
        source: '/users/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_USERS_URL}/api/v1/:path*`,
      },
      {
        source: "/erp/login",
        destination: `${process.env.NEXT_PUBLIC_ERP_URL}/web/session/authenticate`,
      },
      {
        source: "/google/places",
        destination: `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${process.env.GOOGLE_PLACES_API}`,
      }
    ];
  },
};

export default nextConfig;
