const { Order, OrderItem, Customer, Product } = require('../models');
const { Op, Sequelize } = require('sequelize');

const orderController = {
  // GET /api/orders - Get all orders
  getAllOrders: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 50,
        status,
        payment_status,
        customer_id,
        sort = 'created_at',
        sort_order = 'DESC'
      } = req.query;

      const parsedPage = Math.max(1, parseInt(page));
      const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));
      const offset = (parsedPage - 1) * parsedLimit;

      const where = {};

      if (status && status !== 'all') {
        where.status = status;
      }
      if (payment_status && payment_status !== 'all') {
        where.payment_status = payment_status;
      }
      if (customer_id) {
        where.customer_id = parseInt(customer_id);
      }

      let order = [];
      switch (sort) {
        case 'total_amount':
          order.push(['total_amount', sort_order]);
          break;
        case 'status':
          order.push(['status', sort_order]);
          break;
        case 'payment_status':
          order.push(['payment_status', sort_order]);
          break;
        default:
          order.push(['created_at', sort_order]);
      }

      const [orders, total] = await Promise.all([
        Order.findAll({
          where,
          limit: parsedLimit,
          offset,
          order,
          include: [
            {
              model: Customer,
              as: 'customer',
              // ✅ FIXED: Only request columns that exist
              attributes: ['id', 'email']  // Start with just these
              // Add more as needed: ['id', 'email', 'phone']
            },
            {
              model: OrderItem,
              as: 'order_items',
              include: [
                {
                  model: Product,
                  as: 'product',
                  attributes: ['id', 'name', 'price']
                }
              ]
            }
          ]
        }),
        Order.count({ where })
      ]);

      res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
        pagination: {
          page: parsedPage,
          limit: parsedLimit,
          total,
          pages: Math.ceil(total / parsedLimit)
        }
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch orders',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  },

  // GET /api/orders/:id - Get order by ID
  getOrderById: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id, {
        include: [
          {
            model: Customer,
            as: 'customer',
            // ✅ FIXED: Only existing columns
            attributes: ['id', 'email', 'phone']
          },
          {
            model: OrderItem,
            as: 'order_items',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'price', 'img_url']
              }
            ]
          }
        ]
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch order',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  },

  // ... rest of your methods, apply same fix to all Customer includes
};

module.exports = orderController;