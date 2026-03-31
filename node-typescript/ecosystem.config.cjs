module.exports = {
  apps: [
    {
      name: "app",
      script: "./app/main.js",
      max_memory_restart: "500M",
      interpreter: "node",
    },
  ],
};
