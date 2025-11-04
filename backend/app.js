const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const productRoutes = require('./routers/productRoutes');
const categoryRoutes = require('./routers/categoryRoutes');
const customerRoutes = require('./routers/customerRoutes');
const orderRoutes = require('./routers/orderRoutes');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

//api routes 
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);

//sync db 
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Error creating database & tables:', err);
  });

const PORT = 5001;
app.listen(PORT, () => {
  console.log('Server is running on port 5001');
});