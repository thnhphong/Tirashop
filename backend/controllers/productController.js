const { Product, Category, Review, Favorite } = require('../models');
const { Op, Sequelize } = require('sequelize');

const productController = {
  // Create new product
  createProduct: async (req, res) => {
    try {
      console.log('Request body:', req.body);
      console.log('Request files:', req.files);
      const { name, description, price, categoryId, stock } = req.body;

      if (!name || !price || !categoryId) {
        return res.status(400).json({
          success: false,
          message: 'Name, price, and category are required',
        });
      }

      const img_url = req.files?.['img_url']?.[0]
        ? `/uploads/products/${req.files['img_url'][0].filename}`
        : null;

      const thumbnails = {};
      ['1', '2', '3', '4'].forEach((num) => {
        const fieldName = `thumbnail_img_${num}`;
        thumbnails[fieldName] = req.files?.[fieldName]?.[0]
          ? `/uploads/products/${req.files[fieldName][0].filename}`
          : null;
      });

      const product = await Product.create({
        name,
        description: description || null,
        price: parseFloat(price),
        category_id: parseInt(categoryId),
        stock: parseInt(stock) || 0,
        img_url,
        ...thumbnails,
      });

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: productController.transformProduct(product),
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add product',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  },

  // Edit product
  editProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }
      await product.update({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category_id: req.body.categoryId,
        stock: req.body.stock,
        img_url: req.file ? `/uploads/products/${req.file.filename}` : product.img_url,
      });
      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: productController.transformProduct(product),
      });
    } catch (error) {
      console.error('Edit product error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to edit product',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  },

  // Delete product
  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      console.log('Looking for product ID:', req.params.id, 'Found:', product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }
      await product.destroy();
      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete product',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  },

  // Transform a single product object
  transformProduct: (product, forMenu = false) => {
    const baseUrl = process.env.BASE_URL || 'http://localhost:5001';

    const formatUrl = (url) => {
      if (!url) return null;
      if (url.startsWith('http://') || url.startsWith('https://')) return url;
      return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    // Core fields for all responses
    const transformed = {
      id: product.id,
      name: product.name,
      price: product.price,
      img_url: formatUrl(product.img_url),
      category: product.category ? product.category.name : 'Uncategorized',
    };

    // Additional fields for non-menu responses
    if (!forMenu) {
      const reviews = product.reviews || [];
      const averageRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length
        : 0;

      transformed.description = product.description;
      transformed.stock = product.stock;
      transformed.reviews = reviews.length;
      transformed.rating = Math.round(averageRating * 10) / 10;
      transformed.favorites = product.favorites ? product.favorites.length : 0;
      transformed.created_at = product.created_at;
      transformed.thumbnails = {
        thumbnail_img_1: formatUrl(product.thumbnail_img_1),
        thumbnail_img_2: formatUrl(product.thumbnail_img_2),
        thumbnail_img_3: formatUrl(product.thumbnail_img_3),
        thumbnail_img_4: formatUrl(product.thumbnail_img_4),
      };
    }

    return transformed;
  },

  // GET /api/products (consolidated with previous getProducts)
  getAllProducts: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 36,
        category_id,
        category,
        search,
        min_price,
        max_price,
        price,
        sort = 'created_at',
        sort_order = 'DESC',
      } = req.query;

      const parsedPage = Math.max(1, parseInt(page));
      const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));
      const offset = (parsedPage - 1) * parsedLimit;

      const where = {};

      if (category && category !== 'all') {
        const categoryRecord = await Category.findOne({
          where: { name: { [Op.iLike]: category } },
        });
        if (categoryRecord) {
          where.category_id = categoryRecord.id;
        } else {
          return res.status(200).json({
            success: true,
            count: 0,
            data: [],
            pagination: {
              page: parsedPage,
              limit: parsedLimit,
              total: 0,
              pages: 0,
            },
          });
        }
      } else if (category_id) {
        where.category_id = parseInt(category_id);
      }

      if (search && search.trim() !== '') {
        where.name = { [Op.iLike]: `%${search.trim()}%` };
      }

      if (min_price || max_price) {
        where.price = {};
        if (min_price) where.price[Op.gte] = parseFloat(min_price);
        if (max_price) where.price[Op.lte] = parseFloat(max_price);
      } else if (price && price !== 'all') {
        where.price = {};
        switch (price) {
          case 'under10':
            where.price[Op.lt] = 10;
            break;
          case '10to20':
            where.price[Op.between] = [10, 20];
            break;
          case 'over20':
            where.price[Op.gt] = 20;
            break;
          default:
            console.log('Unknown price filter:', price);
        }
      }

      let order = [];
      if (sort === 'rating') {
        order = [[Sequelize.fn('AVG', Sequelize.col('reviews.rating')), sort_order]];
      } else {
        switch (sort) {
          case 'name':
            order.push(['name', sort_order]);
            break;
          case 'price-low-to-high':
            order.push(['price', 'ASC']);
            break;
          case 'price-high-to-low':
            order.push(['price', 'DESC']);
            break;
          case 'relevance':
            order.push(['created_at', 'DESC']);
            break;
          default:
            order.push(['created_at', sort_order]);
        }
      }

      const [products, total] = await Promise.all([
        Product.findAll({
          attributes: ['id', 'name', 'price', 'img_url', 'description', 'stock', 'created_at', 'thumbnail_img_1', 'thumbnail_img_2', 'thumbnail_img_3', 'thumbnail_img_4'],
          where,
          limit: parsedLimit,
          offset,
          order,
          include: [
            { model: Category, as: 'category', attributes: ['name'] },
            { model: Review, as: 'reviews', attributes: ['rating'] },
            { model: Favorite, as: 'favorites', attributes: ['id'] },
          ],
          group: sort === 'rating' ? ['Product.id', 'category.id', 'reviews.id', 'favorites.id'] : undefined,
        }),
        Product.count({ where }),
      ]);

      const transformedProducts = products.map(product => productController.transformProduct(product));

      res.status(200).json({
        success: true,
        count: transformedProducts.length,
        data: transformedProducts,
        pagination: {
          page: parsedPage,
          limit: parsedLimit,
          total,
          pages: Math.ceil(total / parsedLimit),
        },
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          stack: error.stack,
          params: req.params,
          query: req.query,
        } : 'Internal server error',
      });
    }
  },

  // GET /api/products/menu (new endpoint for menu)
  getProductsForMenu: async (req, res) => {
    try {
      const { category, search, sort = 'name', sort_order = 'ASC' } = req.query;

      const where = {};

      // Handle category filter (by name)
      if (category && category !== 'all') {
        const categoryRecord = await Category.findOne({
          where: { name: { [Op.iLike]: category } },
        });
        if (categoryRecord) {
          where.category_id = categoryRecord.id;
        } else {
          return res.status(200).json({
            success: true,
            count: 0,
            data: [],
          });
        }
      }

      // Handle search
      if (search && search.trim() !== '') {
        where.name = { [Op.iLike]: `%${search.trim()}%` };
      }

      // Handle sorting
      let order = [];
      switch (sort) {
        case 'name':
          order.push(['name', sort_order]);
          break;
        case 'price-low-to-high':
          order.push(['price', 'ASC']);
          break;
        case 'price-high-to-low':
          order.push(['price', 'DESC']);
          break;
        default:
          order.push(['name', 'ASC']);
      }

      // Fetch products with limited fields
      const products = await Product.findAll({
        attributes: ['id', 'name', 'price', 'img_url'], // Minimal fields for menu
        where,
        order,
        include: [
          { model: Category, as: 'category', attributes: ['name'] },
        ],
      });

      // Transform products for menu (limited fields)
      const transformedProducts = products.map(product => productController.transformProduct(product, true));

      res.status(200).json({
        success: true,
        count: transformedProducts.length,
        data: transformedProducts,
      });
    } catch (error) {
      console.error('Error fetching products for menu:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products for menu',
        error: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          stack: error.stack,
          query: req.query,
        } : 'Internal server error',
      });
    }
  },

  // GET /api/products/admin - Get all products without limits for admin panel
  getAllProductsForAdmin: async (req, res) => {
    try {
      const {
        category_id,
        category,
        search,
        sort = 'created_at',
        sort_order = 'DESC',
      } = req.query;

      const where = {};

      // Handle category filter (by name)
      if (category && category !== 'all') {
        const categoryRecord = await Category.findOne({
          where: { name: { [Op.iLike]: category } },
        });
        if (categoryRecord) {
          where.category_id = categoryRecord.id;
        } else {
          return res.status(200).json({
            success: true,
            count: 0,
            data: [],
          });
        }
      } else if (category_id) {
        where.category_id = parseInt(category_id);
      }

      // Handle search
      if (search && search.trim() !== '') {
        where.name = { [Op.iLike]: `%${search.trim()}%` };
      }

      // Handle sorting
      let order = [];
      if (sort === 'rating') {
        order = [[Sequelize.fn('AVG', Sequelize.col('reviews.rating')), sort_order]];
      } else {
        switch (sort) {
          case 'name':
            order.push(['name', sort_order]);
            break;
          case 'price-low-to-high':
            order.push(['price', 'ASC']);
            break;
          case 'price-high-to-low':
            order.push(['price', 'DESC']);
            break;
          case 'stock-low-to-high':
            order.push(['stock', 'ASC']);
            break;
          case 'stock-high-to-low':
            order.push(['stock', 'DESC']);
            break;
          default:
            order.push(['created_at', sort_order]);
        }
      }

      // Fetch all products without pagination limits
      const products = await Product.findAll({
        attributes: ['id', 'name', 'price', 'img_url', 'description', 'stock', 'created_at', 'thumbnail_img_1', 'thumbnail_img_2', 'thumbnail_img_3', 'thumbnail_img_4'],
        where,
        order,
        include: [
          { model: Category, as: 'category', attributes: ['name'] },
          { model: Review, as: 'reviews', attributes: ['rating'] },
          { model: Favorite, as: 'favorites', attributes: ['id'] },
        ],
        group: sort === 'rating' ? ['Product.id', 'category.id', 'reviews.id', 'favorites.id'] : undefined,
      });

      const transformedProducts = products.map(product => productController.transformProduct(product));

      res.status(200).json({
        success: true,
        count: transformedProducts.length,
        data: transformedProducts,
      });
    } catch (error) {
      console.error('Error fetching products for admin:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products for admin',
        error: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          stack: error.stack,
          query: req.query,
        } : 'Internal server error',
      });
    }
  },

  // GET /api/products/:id
  getProductDetail: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id, {
        attributes: ['id', 'name', 'price', 'img_url', 'description', 'stock', 'created_at', 'thumbnail_img_1', 'thumbnail_img_2', 'thumbnail_img_3', 'thumbnail_img_4'],
        include: [
          { model: Category, as: 'category', attributes: ['name'] },
          { model: Review, as: 'reviews', attributes: ['rating'] },
          { model: Favorite, as: 'favorites', attributes: ['id'] },
        ],
      });
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }
      res.status(200).json({
        success: true,
        data: productController.transformProduct(product),
      });
    } catch (error) {
      console.error('Error fetching product details:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch product details',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      });
    }
  },
};

module.exports = productController;