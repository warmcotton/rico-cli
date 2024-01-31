var express = require('express');
var router = express.Router();

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


router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});


router.get('/track', function(req, res, next) {
  res.render('track', { title: 'Express' });
});


router.get('/order', function(req, res, next) {
  res.render('order', { title: 'Express' });
});

module.exports = router;