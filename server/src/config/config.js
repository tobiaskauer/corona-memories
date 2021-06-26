module.exports = {
  port: process.env.PORT || 40980,
  //port: process.env.PORT || 3000,
  db: {
    database: process.env.DB_NAME || 'coronaMemories', //database name
    user: process.env.DB_USER || 'coronaMemories',
    password: process.env.DB_USER || 'coronaMemories',
    options: {
      dialect: process.env.DIALECT || 'sqlite',
      host: process.env.HOST || 'localhost',
      storage: process.env.STORAGE || './coronaMemories.sqlite',
      //logging: false
    }
  }
}
