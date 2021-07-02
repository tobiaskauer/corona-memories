module.exports = (sequelize, DataTypes) =>
  sequelize.define('Interaction', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    hash: {
      type: DataTypes.STRING,
    },
    path: {
      type: DataTypes.STRING,
    },
    event: {
      type: DataTypes.STRING,
    },
    element: {
        type: DataTypes.STRING,
    },
  })
