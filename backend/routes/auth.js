const express=require('express')
const router=express.Router()
const User=require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt=require('bcryptjs')
var jwt = require('jsonwebtoken');
var fetchuser=require('../middleware/fetchuser')


const JWT_SECRET="Harryisagoodb$oy"


router.get('/', async (req, res) => {
    
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


//Creating a user using:POST"/api/auth/createuser" No login requires
//Route1
router.post('/createuser',[
    body('name','Enter a vald name').isLength({min:5}),
    body('email','enter a valid email').isEmail(),
    body('password','atleast 5 char').isLength({min:5})
],async(req,res)=>{
    let success=false;
    // obj= {
    //     a:'thios',
    //     number:34
    // }
    // res.json(obj)

    //if there are errors,return bad request and the errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ success,errors: result.array() });
    }
  
   //check if user with same email exists already  
    try{
   let user=await User.findOne({email:req.body.email});
   
   if(user){
    return res.status(400).json({success, error: 'Please enter a unique email'});
   }

   const salt=await bcrypt.genSalt(10);

   const secPass=await bcrypt.hash(req.body.password,salt)
     user=await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email
    })

    const data={
        user:{
            id:user.id
        }
    }

    const authtoken=jwt.sign(data,JWT_SECRET);
    // console.log(jwtData)

    // .then(user => res.json(user))
    //   .catch(err => {
    //     console.log(err);
    //     res.json({ error: 'Please enter a unique email',message:err.message  });
    //   });
    // res.send(req.body);
    // res.json(user)
    success=true;
    res.json({success,authtoken})
}catch(error){
    console.error(error.message);
    res.status(500).send("Some error occured")
}
})

//Authenticate a User using: POST "/api/auth/login". No Login Required
//Route2
router.post('/login',[
    body('email','enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists()
],async(req,res)=>{
    let success=false

    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    } 

    const {email,password}=req.body;

    try{
        let user=await User.findOne({email});
        if(!user){
            success=false
            return res.status(400).json({error:"Enter Correct credentials"})
        }

        const passwordCompare= await bcrypt.compare(password,user.password)

        if(!passwordCompare){
            success=false
            return res.status(400).json({success,error:"Enter Correct credentials"})
        }

        const data={
            user:{
                id:user.id
            }
        }
    
        const authtoken=jwt.sign(data,JWT_SECRET);
        success=true
        res.json({success,authtoken})

    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal server error occured")
    }

})

//Route3
//Get logged in user details

router.post('/getuser',fetchuser,async(req,res)=>{


try {
    userId=req.user.id
    const user=await User.findById(userId).select("-password")
    res.send(user)
    
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error occured")
}
})
module.exports=router