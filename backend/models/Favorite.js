// backend/models/Favorite.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    static associate(models) {
      Favorite.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
        as: 'customer'
      });
      Favorite.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
    }
  }
  
  Favorite.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customers',
        key: 'id'
      }
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Favorite',
    tableName: 'favorites',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['customer_id', 'product_id']
      }
    ]
  });

  Favorite.associate = (models) => {
  Favorite.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
  };
  
  return Favorite;
};