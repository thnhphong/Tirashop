// backend/models/Order.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.Customer, {
        foreignKey: 'customer_id',
        as: 'customer'
      });
      Order.hasMany(models.OrderItem, {
        foreignKey: 'order_id',
        as: 'order_items'
      });
    }
  }
  
  Order.init({
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
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'pending'
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    payment_status: {
      type: DataTypes.STRING(50),
      defaultValue: 'unpaid'
    }
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
  
  return Order;
};