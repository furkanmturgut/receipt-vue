const { defineConfig } = require('@vue/cli-service');
// const fs = require('fs');
module.exports = defineConfig({
  transpileDependencies: true,
  // devServer: {
  //   https: {
  //     key: fs.readFileSync('./ssl/server.key'),
  //     cert: fs.readFileSync('./ssl/server.crt'),
  //   },
  // },
});