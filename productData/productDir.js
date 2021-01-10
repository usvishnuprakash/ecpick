var db = require('../configure/connection')
var Promise = require('promise')
var collection = require('../configure/collections')
const { reject } = require('promise')
const { precompile } = require('handlebars')
const { response } = require('express')
var objectId = require('mongodb').ObjectID
module.exports = {
      addproducts: (product, callback) => {

            db.get().collection("product").insertOne(product).then((data) => {

                  callback(data.ops[0]._id)
            })
      },
      invokeProducts: () => {
            return new Promise(async (resolve, reject) => {
                  let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
                  resolve(products)
            
            })
      },
      deleteproduct: (prodId) => {
            return new Promise((resolve, reject) => {
                  db.get().collection(collection.PRODUCT_COLLECTION).removeOne({ _id: objectId(prodId) }).then((result) => {

                        resolve(result)
                  })
            })
      },
      editProduct: (prodDat) => {
            return new Promise((resolve, reject) => {
                  let product = db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: objectId(prodDat) }).then((response) => {
                        
                        resolve(response)
                  })
            })
      },
      productCorrection:(id,correction)=>{
            return new Promise((resolve,reject)=>{
                  db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:objectId(id)},{
                   $set:{
                         product:correction.product,
                         description:correction.description,
                         price:correction.price,
                         categroy:correction.categroy,
                         specification:correction.specification


                   }
                 
                   }).then((response)=>{
                         resolve()
                   })
            })
      }
}
