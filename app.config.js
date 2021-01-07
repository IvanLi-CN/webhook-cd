module.exports = {
  apps: [
    {
      name: 'webhook-cd',
      script: 'npm',
      args: 'run start:prod',
      watch: false,
      ignore_watch: ['node_modules'],
      log_date_format: 'MM-DD HH:mm:ss.SSS Z',
      env: {},
      max_restarts: 5,
    },
  ],
};
