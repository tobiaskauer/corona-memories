module.exports = (sequelize, DataTypes) =>
  sequelize.define('Memory', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    author: {
      type: DataTypes.STRING,
    },
    comment: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
    },
    weight: {
      type: DataTypes.INTEGER,
      defaultValue: '1'
    },
    date: {
      type: DataTypes.DATEONLY,
    },
    enddate: {
      type: DataTypes.DATEONLY,
    },
  })
