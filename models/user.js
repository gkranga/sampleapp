'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    user_id: DataTypes.STRING,
    token: DataTypes.STRING,
    ip: DataTypes.STRING,
    customer_name: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  });
  return User;
};