// backend/controllers/categoryController.js
const { Category, Product } = require('../models');
const { validationResult } = require('express-validator');

const categoryController = {
  // GET /api/categories
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.findAll({
        include: [
          {
            model: Product,
            as: 'products',
            attributes: ['id', 'name', 'price', 'stock']
          }
        ]
      });
      
      res.json({
        success: true,
        data: categories,
        count: categories.length
      });
    } catch (error) {
      res.status(500).json({
        success: true,
        error: error.message
      });
    }
  },
  //getCategories (version for menu filter)
  getCategories: async (req, res) => {
    try{
      const categories = await Category.findAll({
        attributes: ['id', 'name', 'description', 'image'],
        order: [['name'], 'ASC']
      });
      res.status(200).json(categories);
    }catch (error){
      res.status(500).json({
        success: false,
        message: 'Failed to fetch categories'
      });
    }
  },
  // Get category by ID
  getCategoryById: async (req, res) => {
    const { id } = req.params;
    
    try {
      const category = await Category.findByPk(id);
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch category'
      });
    }
  },
};

module.exports = categoryController;