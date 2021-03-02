const jwt =require('jsonwebtoken');
 module.exports=(req,res,next)=>{
  const token= req.headers.authorization.split(" ")[1];
  console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log(decoded);
    req.userData = decoded;
    next();
    try{
     
    }catch (error){
      res.status(401).json({
          message:"Auth failed"
      })
    }
  }