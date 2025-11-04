// backend/models/Category.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Product, {
        foreignKey: 'category_id',
        as: 'products'
      });
    }
  }
  
  Category.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: false
  });

  Category.associate = function(models) {
  // Category has many Products
  Category.hasMany(models.Product, { 
    foreignKey: 'category_id', 
    as: 'products' 
  });
};
  
  return Category;
};