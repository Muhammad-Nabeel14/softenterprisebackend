const express = require('express');
const router = express.Router();
const {getProductsByUser}=require("../controllers/Product")
// router.post('/signup', signUp);
router.get('/user/:userId', getProductsByUser);

module.exports = router;