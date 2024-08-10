const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const userRoutes=require("./routes/auth")
const multer = require('multer');
const productRoutes=require("./routes/product")
const fs=require("fs")
const path=require("path")
const Product=require("./models/Product")

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    cb(null, dir); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Save files with unique names
  }
});

const upload = multer({ storage: storage });


const uri = process.env.MONGO_URI; 
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use("/user",userRoutes)
app.use("/products",productRoutes)

app.post('/products', upload.array('pictures', 6), async (req, res) => {
  try {
    console.log("hiiiii");
    
    const { name, price, quantity,user } = req.body;
  
    const pictures = req.files.map(file => (
      
      `/uploads/${file.filename}`
    ));

    console.log(pictures);
    

    const newProduct = new Product({
      name,
      price,
      quantity,
      pictures,
      user
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
