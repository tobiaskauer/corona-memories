module.exports = (sequelize, DataTypes) =>
  sequelize.define('Context', {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    country: {
      type: DataTypes.STRING,
    },
    weight: {
      type: DataTypes.INTEGER,
      defaultValue: '1'
    },
    category: {
        type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.DATEONLY,
    },
  })