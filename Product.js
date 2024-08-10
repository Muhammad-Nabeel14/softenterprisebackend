const mongoose = require('mongoose');
const Product = require('../models/Product'); 

const getProductsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId);
    

    const objectId =new mongoose.Types.ObjectId(userId);

    const products = await Product.find({ user: objectId });

    if (!products.length) {
      return res.status(404).json({ message: 'No products found for this user' });
    }

    console.log(products);

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by user:', error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};

module.exports = {
  getProductsByUser,
};
