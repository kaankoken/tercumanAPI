const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

const ProductsControllers = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().getTime() + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    //accept a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        //reject a file
        cb(null, false);
    }

    //if (file.mimetype === 'application/msword' || 
    //file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    //file.mimetype === 'text/plain' || file.mimetype === 'application/vnd.oasis.opendocument.text' ||
    //file.mimetype === 'application/rtf' || file.mimetype === 'application/pdf')
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 *5
    },
    fileFilter: fileFilter,
});

const Product = require('../models/product');

router.get('/', ProductsControllers.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), ProductsControllers.products_create_product);

router.get('/:productId', ProductsControllers.products_get_product);

router.put('/:productId', checkAuth, upload.single('productImage'), ProductsControllers.products_update_product);

router.delete('/:productId', checkAuth, ProductsControllers.products_delete_product);

module.exports = router;