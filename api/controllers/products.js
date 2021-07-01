const express=require('express');
const router=express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
const Order =require('../models/order');

exports.getProducts= (req, res, next) => {
    Product.find()
            .select('price name productImage _id')
            .exec()
            .then(docs=>{
               const response={
                    "Count":docs.length,
                    "Products":docs.map(doc=>{
                       return{
                           name:doc.name,
                           price:doc.price,
                           productImage: doc.productImage,
                           _id:doc._id,
                           request:{
                            methods: "Get",
                            url:"http://localhost:5000/products/"+doc._id
                            }
                       }
                     })
                     
                 }

                res.status(200).json(response);
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json(err);

            })

    
}
exports.getProduct= (req, res, next) => {
    id = req.params.produtId;
    Product.findById(id).select("name price productImage _id").exec().then(product => {
        if(product){
            res.status(201).json({
                product: product,
                    request:{
                        Type:"Get",
                        Url:"http://localhost:5000/products/"
                 
                    }
                }
            )
        }else{
            res.status(404).json({
                messsage: "No vaild entry found for Prouduct ID",
                
            })
        }
       
    }).catch(error => {
            console.log(error);
            res.status(500).json({
                messsage: "Can not get Product",
                error: error
            });
        });
}


exports.addProduct=(req, res, next) => {

    let product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path 
    });
    product.save().then(result => {
        // status 201 mean that successful request and all resources created 
        //it is better to use it with post requests
        res.status(201).json({
            messsage: "Product created",
            createdProduct:result
                
            
        })
    }).catch(error => {
            console.log(error);
            res.status(500).json({
                messsage: "Creadted failed",
                error: error
            });
        });
}
exports.updateProduct=(req, res, next) => {
    const id=req.params.produtId;
    const updatedOps={};
    for(const os of req.body)
    {   
        updatedOps[os.propName]=os.value;
    }
    Product.update({_id:id},{$set:updatedOps})
             .exec()
             .then(result=>{
                 res.status(200).json({
                 message:"Product Successfully Updated.",
                 request:{
                    Type:"Get",
                    Url:"http://localhost:5000/products/"+id
             
                }
                 });
             })
             .catch(err=>{
                 res.status(500).json({
                     error:err
                 });
             });
}
exports.deleteProduct= (req, res, next) => {
    const id=req.params.produtId;
    Product.remove({_id:id})
            .exec()
            .then(result=>{
            res.status(200).json({
              message: 'Product deleted',
              request: {
                  type: 'POST',
                  url: 'http://localhost:5000/products',
                  body: { name: 'String', price: 'Number' }
              }
            });
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({
                    error:err
                });
            });
    
}