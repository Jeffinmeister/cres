const { triggerAsyncId } = require("async_hooks");
const express = require("express")
const app = express();
const hbs = require("hbs");
const path = require("path");
const bcrypt = require("bcrypt");
// const productRoutes = require("../src/routes/product");
// app.use("/product", productRoutes);
let alert = require("alert");

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
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


require("./db/conn");


const Register = require("./models/registers");
const Product =  require("./models/products");
const port = process.env.PORT || 3000
const static_path = path.join(__dirname, "../static");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
const upload_path = path.join(__dirname, "./uploads");

app.use(express.json());
app.use('/uploads',express.static('./uploads'));
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path)

app.get("/", (req,res) => {
    res.render("index")

});
app.get("/login", (req,res) => {
    res.render("login");
})

app.get("/register", (req,res) => {
    res.render("register");
})

// app.get("/product", (req,res) => {
//     res.render("product");
// })

app.post("/register", async(req,res) => {
    try {
        
       const password = req.body.password;
       const cpassword = req.body.confirmpassword;
        
       if(password === cpassword) {
           const registerUser = new Register({
               email : req.body.email,
               password: req.body.password,
               confirmpassword: req.body.confirmpassword
           })

           const registered = await registerUser.save();
           res.status(201).render("login");

       }else {
           alert("password not matching");
       }
    } catch (error) {
        alert("Email Already Registered");
        
    }
})



app.post("/login", async(req,res) => {
    try {
        const email =req.body.email;
        const password = req.body.password;
        const useremail = await Register.findOne({email:email});
        console.log(useremail);
        
        if(useremail.password === password) {
            res.status(201).render("product");
        } else {
            alert("Login Credential wrong");
        }
    } catch (error) {
       alert("Login Credential wrong");
        
    }
})

app.listen(port, () => {
    console.log("Server is running at 3000");

})



//Product

// app.get('/product/:id', (req, res) => {
//     Product.findById(req.body._id, (error, docs) =>{
//         // if (error)
//         //     res.send('error: ' + error);
//         console.log(req.body._id)
//         //update attributes of the product with req fields
//         Product.name = req.body.ProductName;
//         Product.price = req.body.Price;
//         //save
//         docs.save(function (error) {
//             if (error)
//                 res.status(500).send('Failed to update product. ERROR: ' + error);
//             res.json({message: 'Product update successful!'});
//         });
//     });
// });

app.get("/crud", (req,res) => {
    res.render("crud");
});



// app.post('/crud', upload.single('productImage'), (req,res,next) => {
//     console.log(req.file);
//      const newProduct = new Product({
//               name : req.body.ProductName,
//               price : req.body.Price,
//             //   productImage: req.file.path
              
//            })
//            const productNew =  newProduct.save();
//            res.status(201).render("action");
//         });

// app.post('/crud', (req, res) => {
//     if (req.body._id == ''){
//         insertRecord(req, res);
//     }
// });
app.post('/crud', (req,res) => {
     const newproduct = new Product({
         name : req.body.ProductName,
         price: req.body.Price
     });
     newproduct.save();
     res.status(201).render("action");
        // res.status(201).json({
        //     message: "Created product successfully",
        //     createdProduct: {
        //         name: result.name,
        //         price: result.price,
        //         _id: result._id,
        //         request: {
        //             type: 'GET',
        //             url: "http://localhost:3000/product/" + result._id
        //         }
        //     }
        });
        



app.get('/product', (req, res) => {
    Product.find((err, docs) => {
        if (!err) {
            res.render("product", {
                product: docs
            });
        }
        else {
            console.log('Error in retrieving product list :' + err);
        }
    });
});





app.get('/product/delete/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id, (err, docs) => {
        if (!err) {
            res.render("action")
        }
        else { console.log('Error in product delete :' + err); 
           
        }
    });
});



