// backend/models/FAQ.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FAQ extends Model {
    // No associations for FAQ
  }
  
  FAQ.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'FAQ',
    tableName: 'faqs',
    timestamps: false
  });
  
  return FAQ;
};