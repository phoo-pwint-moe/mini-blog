module.exports = {
  apps: [
    {
      name: "backend",
      script: "dist/main.js", // NestJS build entry
      cwd: "./blog-backend", // working directory for backend
      instances: 4,
      exec_mode: "cluster",
      max_memory_restart: "300M",
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 4000, // backend port
      },
    },
    {
      name: "frontend",
      script: "npm",
      args: "run start:serve", // working directory for frontend
      autorestart: true,
      watch: false,
      cwd: "/home/mozart/Documents/nest/blog_pj/blog-frontend",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
