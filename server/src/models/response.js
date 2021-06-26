module.exports = (sequelize, DataTypes) =>
  sequelize.define('Survey', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    hash: {
      type: DataTypes.STRING,
    },
    survey: {
      type: DataTypes.STRING,
    },
    checkboxes: {
        type: DataTypes.STRING,
    },
    comment: {
        type: DataTypes.STRING,
    },
  })
