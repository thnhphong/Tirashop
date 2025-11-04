const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

//get all customers
router.get('/', customerController.getAllCustomers);

router.get('/profile/:id', customerController.getCustomerById);

//create customer
router.post('/signup', customerController.createCustomer);

//login customer
router.post('/login', customerController.loginCustomer);

const multer = require('multer');
// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage });

// 🔹 Update profile
router.put('/profile/:id', customerController.updateCustomer);

//upload avatar 
router.post('/profile/:id/avatar', upload.single('avatar'), customerController.uploadAvatar);

module.exports = router;