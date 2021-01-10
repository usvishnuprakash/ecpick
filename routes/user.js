var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt')
var productDirs = require('../productData/productDir');
const newUsers = require('../userData/users');
const { response } = require('express');
const session = require('express-session');
const verifysignin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.render('login/signIn')
  }
}


/* GET users listing. */
router.get('/', async function (req, res, next) {
  let cCount = 0
  let user = req.session.user
  if (req.session.user) {
    console.log("helo")
    cCount = await newUsers.cartCount(req.session.user._id).then((response) => {
      if (cCount) {
        productDirs.invokeProducts().then((products) => {



          res.render('userEnd/user-end', { products, user,cCount})
        })

      }
    })


  }

  productDirs.invokeProducts().then((products) => {
    let user = req.session.user


    res.render('userEnd/user-end', { products, user, cCount })
  })








})
router.get('/signUp', function (req, res) {

  res.render('login/signUp')
})
router.get('/signIn', function (req, res) {
  if (req.session.loggedIn) {
    res.redirect('/')
  } else {

    res.render('login/signIn', { "loginErr": req.session.loginErr })
  }
  req.session.loginErr = false
})
router.post('/signUp', (req, res) => {

  newUsers.newsign(req.body).then((response) => {
    req.session.loggedIn = true
    req.session.user = response
    res.render("login/signIn")
  })
})
router.post('/signIn', (req, res) => {
  newUsers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      
      res.redirect('/')
    } else {
      req.session.loginErr = "invaild user"
      res.redirect('/signIn')
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})
router.get('/cart', verifysignin, async (req, res) => {
  let product = await newUsers.cartProduct(req.session.user._id)

  res.render('userEnd/cart', { product })
})
router.get('/addtoCart/:id', (req, res) => {
  newUsers.usercart(req.params.id, req.session.user._id).then((response) => {
    res.json({ status: true })
  })
})
router.post('/change-product-quantity', (req, res) => {
  
  newUsers.changeQuan(req.body).then()

})









module.exports = router;