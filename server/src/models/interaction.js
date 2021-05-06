module.exports = (sequelize, DataTypes) =>
  sequelize.define('Interaction', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    session: {
      type: DataTypes.STRING,
    },
    event: {
      type: DataTypes.STRING,
    },
    element: {
        type: DataTypes.STRING,
    },
  })
