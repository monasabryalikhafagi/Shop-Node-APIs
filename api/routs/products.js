const express=require('express');
const router=express.Router();
var multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const productController = require('../controllers/products');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});
const Product = require('../models/product');

router.get('/', productController.getProducts);
router.post('/', upload.single('productImage'), checkAuth, productController.addProduct);
router.get('/:produtId', productController.getProduct);
router.patch('/:produtId', checkAuth, productController.updateProduct);
router.delete('/:produtId', checkAuth, productController.deleteProduct);

module.exports = router;