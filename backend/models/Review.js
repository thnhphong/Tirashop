// backend/models/Review.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
        as: 'customer'
      });
      Review.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
    }
  }
  
  Review.init({
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
    },
    rating: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 5
      }
    },
    content: {
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

 Review.associate = function(models) {
  // Review belongs to Product
  Review.belongsTo(models.Product, { 
    foreignKey: 'product_id', 
    as: 'product' 
  });
  
  // Review belongs to User (if you have users)
  // Review.belongsTo(models.User, { 
  //   foreignKey: 'user_id', 
  //   as: 'user' 
  // });
  };
  
  return Review;
};