// backend/models/Offer.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Offer extends Model {
    // No associations for Offer
  }
  
  Offer.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    discount_percent: {
      type: DataTypes.DECIMAL(5, 2),
      validate: {
        min: 0,
        max: 100
      }
    },
    expire_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Offer',
    tableName: 'offers',
    timestamps: false
  });
  
  return Offer;
};