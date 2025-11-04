// backend/config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Database configuration
const dbConfig = {
  development: {
    username: process.env.DB_USER || 'tothanhphong',
    password: process.env.DB_PASSWORD || 'Phong@2025',
    database: process.env.DB_NAME || 'tirashop',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false, // Set to console.log to see SQL queries
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

// Create Sequelize instance
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    pool: config.pool,
    define: {
      freezeTableName: true, // Prevent Sequelize from pluralizing table names
      timestamps: false // Disable timestamps by default
    }
  }
);

// Test database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully to PostgreSQL');
    console.log(`📊 Connected to database: ${config.database}`);
    console.log(`🌐 Host: ${config.host}:${config.port}`);
  } catch (error) {
    console.error('❌ Unable to connect to database:', error.message);
    process.exit(1);
  }
};

// Close database connection
const disconnectDB = async () => {
  try {
    await sequelize.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
};

module.exports = {
  sequelize,
  connectDB,
  disconnectDB,
  config
};