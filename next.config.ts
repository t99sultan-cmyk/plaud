import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/audio",
  async redirects() {
    return [
      // Любой путь без /audio — редирект на /audio/path
      // Исключаем _next (статика) и favicon
      {
        source: "/:path((?!audio|_next|favicon).*)",
        destination: "/audio/:path",
        permanent: false,
        basePath: false,
      },
      {
        source: "/",
        destination: "/audio",
        permanent: false,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;
