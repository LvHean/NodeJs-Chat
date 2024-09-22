module.exports = {
  apps: [
    {
      name: 'chat_staging',
      script: './dist/app.js',
      instances : "1",
      exec_mode : "cluster",
      watch: false,
      interpreter_args: '--harmony',
      env: {
        NODE_ENV:"STAGING",
        PORT: 8000,
        SOCKET_PORT: 8100,
        MONGODB_HOST: "",
        MONGODB_PORT: "",
        MONGODB_USERNAME: "",
        MONGODB_PASSWORD: "",
        MONGODB_AUTHSOURCE: "",
        MONGODB_DATABSE_NAME: ""
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss:SSS Z",
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      listen_timeout: "2500",
      post_update: ["npm i", "npm run staging"]
    },
    {
      name: 'chat',
      script: './dist/app.js',
      instances : "1",
      exec_mode : "cluster",
      watch: false,
      interpreter_args: '--harmony',
      env: {
        NODE_ENV:"PRODUCTION",
        PORT: 8000,
        SOCKET_PORT: 8100,
        MONGODB_HOST: "",
        MONGODB_PORT: "",
        MONGODB_USERNAME: "",
        MONGODB_PASSWORD: "",
        MONGODB_AUTHSOURCE: "",
        MONGODB_DATABSE_NAME: ""
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss:SSS Z",
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      listen_timeout: "2500",
      post_update: ["npm i", "npm run prod"]
    }
  ]
}

