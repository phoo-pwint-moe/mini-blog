module.exports = {
  apps: [
    {
      name: "backend",
      script: "dist/main.js", // NestJS build entry
      cwd: "./blog-backend", // working directory for backend
      instances: 1, // or "max" for cluster mode
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 4000, // backend port
      },
    },
    {
      name: "frontend",
      script: "server.js",
      cwd: "./blog-frontend/dist", // working directory for frontend
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
