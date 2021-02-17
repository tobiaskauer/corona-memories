const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../config/config')
const db = {}

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  config.db.options,
)

fs //looping through the Models folders and load data models to sequelize
  .readdirSync(__dirname)
  .filter((file) =>
    file !== 'index.js'
  )
  .forEach(file => {
    //const model = sequelize.import(path.join(__dirname, file))
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes) //changed as to https://stackoverflow.com/questions/62917111/sequelize-import-is-not-a-function
    db[model.name] = model
  })

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
