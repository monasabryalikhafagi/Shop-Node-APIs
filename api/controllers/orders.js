const mongoose=require('mongoose');
const Order =require('../models/order');
const Product = require('../models/product');

exports.getOrders=(req,res,next)=>{
    Order.find()
    .populate("product","name")
    .exec()
    .then(docs=>{
         res.status(200).json({
             count:docs.length,
             orders:docs.map(doc=>{
              return{
                  _id:doc._id,
                  product:doc.product,
                  quantity:doc.quantity,
                  request:{
                      Type:"Get",
                      Url:"http://localhost:5000/orders/"+doc._id
                  }
              }
             })
         });
    }).catch(err=>{
        console.log(err);
       res.status(500).json({
           error:err,
           reason:err.reason
       });
   });
}
exports.getOrder=(req,res,next)=>{
    let id=req.params.ordeId;
      Order.findById({_id:id})
      .populate("product")
      .select("quantity product _id")
      .exec().then(doc=>{
          if(doc){
              res.status(201).json({
                  order: doc,
                      request:{
                          Type:"Get",
                          Url:"http://localhost:5000/orders/"
                   
                      }
                  }
              )
          }else{
              res.status(404).json({
                  messsage: "No vaild entry found for Orders ID",
                  
              })
          }
  
      }).catch(err=>{
          console.log(err);
         res.status(500).json({
             error:err
         });
     });
  
  }
exports.addOrder=(req,res,next)=>{
    Product.findById({_id:req.body.product})
    .exec()
    .then(doc=>{
         if(!doc){
             res.status(500).json({
                 messsage:"Product Note found "
             });
         }
        let order= new Order({
            _id:mongoose.Types.ObjectId(),
            product:req.body.product,
            quantity:req.body.quantity
          
        });
       order.save().then(result=>{
            res.status(201).json({
                message: "Order stored",
                createdOrder: {
                  _id: result._id,
                  product: result.product,
                  quantity: result.quantity
                },
            });
        })
    }).catch(err=>{
        console.log(err);
        console.log(err.reason);
       res.status(500).json({
           error:err,
           reason:err.reason
       });
   });
}

exports.updateOrder=(req,res,next)=>{
    const id=req.params.orderId;
    const updatedOps={};
    for(const os of req.body)
    {   
        updatedOps[os.propName]=os.value;
    }
    Order.update({_id:id},{$set:updatedOps})
             .exec()
             .then(result=>{
                 res.status(200).json({
                 message:"Order Successfully Updated.",
                 request:{
                    Type:"Get",
                    Url:"http://localhost:5000/orders/"+id
             
                }
                 });
             })
             .catch(err=>{
                 res.status(500).json({
                     error:err
                 });
             });
}
exports.deleteOrder=(req,res,next)=>{
    const id=req.params.orderId;
    Order.remove({_id:id})
            .exec()
            .then(result=>{
            res.status(200).json({
              message: 'Order deleted',
              request: {
                  type: 'POST',
                  url: 'http://localhost:5000/order',
                  body: { productId: "ID", quantity: "Number" }
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