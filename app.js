const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose =  require('mongoose');

const productRoutes = require('./api/route/products');
const orderRoutes = require('./api/route/orders');
const userRoutes = require('./api/route/user');
const languageRoutes = require('./api/route/languages');
const cors = require('cors');

global.__rootdir = __dirname;  

mongoose.connect('mongodb+srv://legolas:' + process.env.MONGO_ATLAS_PW + '@tercumanapi-hxo0m.gcp.mongodb.net/test?retryWrites=true', {
    useNewUrlParser: true
});
app.use(cors());
app.use('/public/uploads', express.static('uploads'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((res, req, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Header', 'Origin, X-Request-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST ,PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);
app.use('/language', languageRoutes);

app.use((req, res, next) => {
    const error =  new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;