/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import BundleAnalyzer from "@next/bundle-analyzer";
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    turbo: {
      resolveAlias: {},
    },
    reactCompiler: true,
  },
};

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(config);
