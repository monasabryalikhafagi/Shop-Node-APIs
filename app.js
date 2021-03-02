const express =require('express');
const app=express();
const morgan=require('morgan');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const productRoutes=require('./api/routs/products');
const orderRoutes=require('./api/routs/orders');
const userRoutes=require('./api/routs/users');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost/shop" , {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/users',userRoutes);

app.use((req,res,next)=>{
  console.log(req.body);
 const error=new Error('Not found');
error.status=404;
next(error);
});
app.use((error,req,res,next)=>{
  console.log(error);
     res.status(error.status||500);
     res.json({
         error:{
             messsage:error.messsage
         }
     })

   });

module.exports=app;