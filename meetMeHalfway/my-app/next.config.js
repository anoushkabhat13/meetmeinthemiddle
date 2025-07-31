// meetMeHalfway/my-app/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone", // <--- ADD THIS LINE
  };
  
  module.exports = nextConfig; // Ensure you're using CommonJS export if it's the default
