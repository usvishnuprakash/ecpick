
var express = require('express');

var router = express.Router();

var productDir = require('../productData/productDir');

/* GET home page. */
router.get('/admin', function (req, res, next) {

  productDir.invokeProducts().then((products) => {
    
    res.render('admin/products', { products, admin: true })
  })


});
router.get('/add-products', function (req, res) {
  res.render('admin/add-products')
})
router.post('/add-products', function (req, res) {

  productDir.addproducts(req.body, (callback) => {
    let Images = req.files.image
  
    Images.mv('./public/datas/' + callback + '.jpg', (err, done) => {
      if (!err) {
        res.render('admin/add-products')

      } else {
        console.log(err)
      }
    })
  })
})
router.get('/admin/deleteproduct/:id', function (req, res) {
  let prodId = req.params.id
  
  productDir.deleteproduct(prodId).then((result) => {
    res.redirect('/admin')

  })
})
router.get('/admin/editproduct/:id',async  function(req,res){
  let id=req.params.id
  let detailes=await productDir.editProduct(id)
  res.render('userEnd/editProduct',{detailes})
})
router.post('/admin/editproduct/:id',function (req,res){
  let id=req.params.id
  productDir.productCorrection(req.params.id,req.body).then(()=>{
    
    res.redirect('/admin')
    
    if(req.files.image){
      let image=req.files.image
      image.mv('./public/datas/' +id+ '.jpg')
    
  }

    

  })
})



module.exports = router;
