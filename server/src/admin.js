const express = require("express");
const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroSequelize = require('@admin-bro/sequelize')
AdminBro.registerAdapter(AdminBroSequelize);
const adminBro = require('./admin');
const PORT = 3000;
const app = express();
const router = AdminBroExpress.buildRouter(adminBro)
app.use(adminBro.options.rootPath, router);
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});


