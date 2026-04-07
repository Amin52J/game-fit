import type { NextConfig } from "next";
import { readFileSync } from "fs";

const { version } = JSON.parse(readFileSync("./package.json", "utf-8"));

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  compiler: { styledComponents: true },
  env: { NEXT_PUBLIC_APP_VERSION: version },
};

export default nextConfig;
