const express = require('express');
const router = express.Router();
const request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/items', function(req, res, next) {
  res.render('items', { title: 'Express' });
});


router.get('/item', function(req, res, next) {
  res.render('item', { title: 'Express' });
});


router.get('/cart', function(req, res, next) {
  res.render('cart', { title: 'Express' });
});

router.get('/orders', function(req, res, next) {
  res.render('orders', { title: 'Express' });
});


router.get('/login', function(req, res, next) {
  const path = req.query.path ?? "";
  res.render('login', { path: path });
});


router.get('/track', function(req, res, next) {
  res.render('track', { title: 'Express' });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Express' });
});


router.get('/order/:orderId', function(req, res, next) {
  
  res.render('order', { title: 'Express' });
});


router.get('/items/category', function(req, res, next) {
  res.render('category', { title: 'Express' });
});
module.exports = router;