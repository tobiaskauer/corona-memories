const AdminBro = require('admin-bro');
const { Case, Memory } = require('../models');
const adminBro = new AdminBro({
   rootPath: '/admin',
   loginPath: '/admin/login',
   resources: [Case, Memory],
   branding: {
     companyName: 'AdminBro Tutorial',
     softwareBrothers: false,
   }
});
module.exports = adminBro;