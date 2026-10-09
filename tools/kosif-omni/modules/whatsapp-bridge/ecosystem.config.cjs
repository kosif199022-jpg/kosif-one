module.exports = {
  apps: [
    {
      name: 'jev-whatsapp-bridge',
      script: 'src/server.js',
      interpreter: 'node',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      time: true,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
