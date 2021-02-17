module.exports = (sequelize, DataTypes) =>
  sequelize.define('Case', {
    date: {
      type: DataTypes.DATEONLY,
    },
    cumulative: {
      type: DataTypes.INTEGER,
    },
    new: {
      type: DataTypes.INTEGER,
    },
    relative: {
      type: DataTypes.INTEGER,
    },
    country: {
      type: DataTypes.STRING,
    },
  })
