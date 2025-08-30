module.exports = {
  apps: [
    {
      name: 'aireach',
      script: 'npx',
      args: 'wrangler pages dev dist --d1=aireach-production --local --ip 0.0.0.0 --port 3000',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false, // Disable PM2 file monitoring - wrangler handles hot reload
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}