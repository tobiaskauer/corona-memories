module.exports = (sequelize, DataTypes) =>
  sequelize.define('Memory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING,
    },
    weight: {
      type: DataTypes.INTEGER,
    },
    date: {
      type: DataTypes.DATEONLY,
    },
  })
