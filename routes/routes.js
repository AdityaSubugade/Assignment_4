const express= require('express');
const router = express.Router();
const user =require('../models/users');
const multer = require('multer');
const fs = require("fs");


//img uplode

var storage = multer.diskStorage({
    destination: function(req,file, cb){
        cb(null,'./uploads')
    },
    filename: function(req,file,cb){
        cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);
    },
});

var uplod = multer({
    storage:storage,
}).single("image");

//insert an user into the database
router.post('/add', uplod, (req,res)=>{
    const User = new user({
        productName:req.body.pName,
        quantity:req.body.quntity,
        price:req.body.price,
        image:req.file.filename,
        productDescription:req.body.description
        
    })
    User.save((err) => {
        if(err){
            console.log(err)
            res.json({massage: err.massage, type: 'danger'});
        }else{
            req.session.massage={
                type : 'success',
                massage: 'user added succefully! '
            };
            res.redirect('/');
        }
    })
})



//get all users route

router.get('/',(req,res)=>{
    user.find().exec((err, users)=>{
        if(err){
            console.log(err)
            res.json({massage: err.massage, type: 'danger'});
        }else{
            res.render("index",{
                title :"Home Page",
                users:users
            });
        }
    })
});



//edit an user route
router.get('/edit/:id', (req, res)=>{
    let id = req.params.id;
    user.findById(id,(err,user)=>{
        if(err){
            res.redirect('/');
        }else{
            if(user == null){
                res.redirect('/');
            }else{
                res.render('edit_users',{
                    title: "Edit User",
                    user:user
                });
            }
        }
    })
});


//update user route

router.post('/update/:id', uplod, (req,res)=>{
    let id = req.params.id;
    let new_image = '';
    if(req.file){
        new_image = req.file.filename;
        try{
            fs.unlinkSync('./uploads/'+req.body.old_image);
        }catch(err){
            console.log(err);
        }
    }else{
        new_image =req.body.old_image;
    }
    user.findByIdAndUpdate(id, {
        productName:req.body.pName,
        quantity:req.body.quntity,
        price:req.body.price,
        image:new_image,
        productDescription:req.body.description
    }, (err, result)=> {
        if(err){
            res.json({massage: err.massage, type: "danger"});
        }else{
            req.session.massage={
                type: 'success',
                massage: 'user updated successfully!',
            };
            res.redirect('/');
        }
    })
});


//delet user route
router.get("/delete/:id", (req,res)=>{
    let id = req.params.id;
    user.findByIdAndRemove(id,(err, result)=>{
        if(result.image){
            try{
                fs.unlinkSync("./uploads/"+result.image);
            }catch(err){
                console.log(err);
            }
        }
        if(err){
            res.json({message: err.message});
        }else{
            req.session.message = {
                type: "info",
                message: "user deleted Successfully!"
            };
            res.redirect("/");
        }
    }) 
})

router.get('/add', (req,res)=>{
    res.render("add_users",{title: "Add Users"});

})

module.exports = router;