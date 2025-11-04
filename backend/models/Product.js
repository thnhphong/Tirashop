'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category'
      });
      Product.hasMany(models.OrderItem, {
        foreignKey: 'product_id',
        as: 'order_items'
      });
      Product.hasMany(models.Review, {
        foreignKey: 'product_id',
        as: 'reviews'
      });
      Product.hasMany(models.Favorite, {
        foreignKey: 'product_id',
        as: 'favorites'
      });
    }

    // Helper method to get all product images as an array
    getProductImages() {
      const images = [];
      if (this.img_url) images.push(this.img_url);
      if (this.thumbnail_img_1) images.push(this.thumbnail_img_1);
      if (this.thumbnail_img_2) images.push(this.thumbnail_img_2);
      if (this.thumbnail_img_3) images.push(this.thumbnail_img_3);
      if (this.thumbnail_img_4) images.push(this.thumbnail_img_4);
      return images;
    }
  }
  
  Product.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
        notNull: true
      }
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    img_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    thumbnail_img_1: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    thumbnail_img_2: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    thumbnail_img_3: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    thumbnail_img_4: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: false
  });

    Product.associate = function(models) {
      // Product belongs to Category
      Product.belongsTo(models.Category, { 
        foreignKey: 'category_id', 
        as: 'category' 
      });
      
      // Product has many Reviews
      Product.hasMany(models.Review, { 
        foreignKey: 'product_id', 
        as: 'reviews' 
      });
      
      // Product has many Favorites
      Product.hasMany(models.Favorite, { 
        foreignKey: 'product_id', 
        as: 'favorites' 
      });
  };
  return Product;
};