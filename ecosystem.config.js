module.exports = {
  apps: [
    {
      name: "backend",
      script: "dist/main.js", // NestJS build entry
      cwd: "./blog-backend", // working directory for backend
      instances: "max",
      exec_mode: "cluster",
      max_memory_restart: "500M",
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
      args: "run start:serve",
      instances: "max",
      exec_mode: "cluster",
      max_memory_restart: "500M",
      autorestart: true,
      watch: false,
      cwd: "/home/mozart/Documents/nest/blog_pj/blog-frontend",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
