module.exports = (sequelize, DataTypes) =>
  sequelize.define('Memory', {
    text: {
      type: DataTypes.STRING,
    }
  })
