module.exports = (sequelize, DataTypes) =>
  sequelize.define('Memory', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    /*author: {
      type: DataTypes.STRING,
    },*/
    comment: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
    },
    hash: {
      type: DataTypes.STRING,
    },
    /*weight: {
      type: DataTypes.INTEGER,
      defaultValue: '1'
    },*/
    exactDate: {
      type: DataTypes.BOOLEAN,
    },
    date: {
      type: DataTypes.DATEONLY,
    },
    enddate: {
      type: DataTypes.DATEONLY,
    },
    flagged: {
      type: DataTypes.BOOLEAN,
      defaultValue: '0'
    },
  })
