const remotePatterns = [];

if (process.env.DIRECTUS_URL) {
  try {
    const raw = process.env.DIRECTUS_URL.trim();
    const directusUrl = raw.includes("://") ? raw : `http://${raw}`;
    const url = new URL(directusUrl);
    remotePatterns.push({
      protocol: url.protocol.replace(":", ""),
      hostname: url.hostname,
      port: url.port || undefined,
      pathname: "/assets/**",
    });
  } catch (error) {
    console.warn("Invalid DIRECTUS_URL provided in next.config.mjs", error);
  }
}

remotePatterns.push({
  protocol: "https",
  hostname: "lh3.googleusercontent.com",
  pathname: "/**",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
