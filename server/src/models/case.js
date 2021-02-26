module.exports = (sequelize, DataTypes) =>
  sequelize.define('Case', {
    date: {type: DataTypes.DATEONLY},
    country: {type: DataTypes.STRING},

    "absolute_cases": {type: DataTypes.INTEGER},
    "absolute_deaths": {type: DataTypes.INTEGER},
    "absolute_recovered": {type: DataTypes.INTEGER},

    "new_cases": {type: DataTypes.INTEGER},
    "new_deaths": {type: DataTypes.INTEGER},
    "new_recovered": {type: DataTypes.INTEGER},

    "relative_cases": {type: DataTypes.INTEGER},
    "relative_deaths": {type: DataTypes.INTEGER},
    "relative_recovered": {type: DataTypes.INTEGER},
  })