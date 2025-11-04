const { Customer } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const customerController = {
  //get all customers
  getAllCustomers: async (req, res) => {
    try {
      const customers = await Customer.findAll();
      res.status(200).json({
        success: true,
        customers,
      });
    } catch (err) {
      console.error("Error fetching customers:", err);
      res.status(500).json({ success: false, message: "Failed to fetch customers" });
    }
  },
  // ... existing loginCustomer
  getCustomer: async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }
    try {
      // ✅ Verify token just to ensure user is authenticated
      jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Use ID from route params
      const { id } = req.params;
      const customer = await Customer.findByPk(id, { attributes: ['id', 'name', 'email', 'address'] });

      if (!customer) {
        return res.status(404).json({ success: false, message: "Customer not found" });
      }

      res.status(200).json({ success: true, customer });
    } catch (err) {
      console.error("Error fetching customer:", err);
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  },
  //create customer
  createCustomer: async(req, res) => {
    const { name, email, phone, password } = req.body;
    //validate fields 
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    };
    try{
      const hashedPassword = await bcrypt.hash(password, 10);
      const customer = await Customer.create({
        name, email, phone, password: hashedPassword,
      });
      res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        },
      });
    }catch(err){
      console.error("Error creating customer:", err);
      res.status(500).json({ success: false, message: "Failed to create customer" });
    }
  },
  //login customer 
  loginCustomer: async(req, res) => {
    const {email, password } = req.body;
    if(!email || !password){
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    try{
      const customer = await Customer.findOne({
        where: { email }
      })
      if (!customer) {
        return res.status(404).json({ success: false, message: "Customer not found" });
      }
      const isMatch = await bcrypt.compare(password, customer.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
      }
      const token = jwt.sign(
        { id: customer.id, email: customer.email, name: customer.name },
        process.env.JWT_SECRET || '0e8K9b0bU5UAcsZb89CLnQ8OtTFTiATbC5AdHjhk2LU=',
        { expiresIn: '1h' }
      );

      console.log('Generated token: ', token);
      const { password: _, ...userWithoutPassword } = customer.toJSON()

      // ✅ Send token + user info
      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: userWithoutPassword,
      });
    }catch(err){
      console.error("Error logging in customer:", err);
      res.status(500).json({ success: false, message: "Failed to log in customer" });
    }
  },
  getCustomerById: async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: "No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Optional: prevent users from accessing other profiles
      if (decoded.id !== parseInt(req.params.id)) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }

      const customer = await Customer.findByPk(req.params.id, {
        attributes: ['name', 'email', 'address', 'phone']
      });

      if (!customer) return res.status(404).json({ success: false, message: "Customer not found" });

      res.status(200).json({ success: true, customer });
    } catch (err) {
      console.error("Error fetching customer:", err);
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  },
  updateCustomer: async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    try {
      const customer = await Customer.findByPk(id);
      if (!customer) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
      }

      customer.name = name || customer.name;
      customer.email = email || customer.email;
      customer.phone = phone || customer.phone;
      customer.address = address || customer.address;

      await customer.save();

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        customer,
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
  },
  uploadAvatar: async (req, res) => {
    const { id } = req.params;
    try {
      const customer = await Customer.findByPk(id);
      if (!customer) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
      }

      // file uploaded by multer
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      // Save avatar path (e.g. 'uploads/avatars/<filename>')
      customer.avatar = `/uploads/avatars/${req.file.filename}`;
      await customer.save();

      res.status(200).json({
        success: true,
        message: 'Avatar updated successfully',
        avatar: customer.avatar,
      });
    } catch (err) {
      console.error('Error uploading avatar:', err);
      res.status(500).json({ success: false, message: 'Failed to upload avatar' });
    }
  },
};

module.exports = customerController;