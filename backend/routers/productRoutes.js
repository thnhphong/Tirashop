const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const multer = require("multer");
const path = require("path");

// Configure storage for uploads/products
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products");
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName = `${Date.now()}_${file.originalname}`;
    cb(null, fileName);
  },
});

// Define upload configuration
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    console.log('Processing file:', file.fieldname, file.originalname);
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only .png, .jpg and .jpeg formats are allowed!"));
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// GET all products (handles ?category=name, ?category_id=id, pagination, etc.)
router.get("/", productController.getAllProducts);

//get product for menu (limited fields)
router.get("/menu", productController.getProductsForMenu);

// GET all products for admin (no limits) - must be before /:id route
router.get("/admin", productController.getAllProductsForAdmin);

// GET product detail
router.get("/:id", productController.getProductDetail);

// CREATE product route with proper field names
router.post(
  "/create",
  upload.fields([
    { name: "img_url", maxCount: 1 },
    { name: "thumbnail_img_1", maxCount: 1 },
    { name: "thumbnail_img_2", maxCount: 1 },
    { name: "thumbnail_img_3", maxCount: 1 },
    { name: "thumbnail_img_4", maxCount: 1 },
  ]),
  productController.createProduct
);

// EDIT product
router.put("/edit/:id", upload.single("img_url"), productController.editProduct);

// DELETE product
router.delete("/delete/:id", productController.deleteProduct);

// Debug middleware to see what's being called
router.use((req, res, next) => {
  console.log('=== Product Route Debug ===');
  console.log('Method:', req.method);
  console.log('Original URL:', req.originalUrl);
  console.log('Route Path:', req.route?.path);
  console.log('Params:', req.params);
  console.log('Query:', req.query);
  console.log('========================');
  next();
});

module.exports = router;