var db = require('../configure/connection')
var Promise = require('promise')
var collection = require('../configure/collections')
const collections = require('../configure/collections')
var bcrypt = require('bcrypt')
const { reject, resolve } = require('promise')
const { ObjectID } = require('mongodb')
const { response } = require('express')
var objectId = require('mongodb').ObjectID

module.exports = {
    newsign: (newuser) => {
        return new Promise(async (resolve, reject) => {
            newuser.password = await bcrypt.hash(newuser.password, 10)

            db.get().collection(collections.USER_COLLECTION).insertOne(newuser).then((data) => {

                resolve(data.ops[0])
            })
        })

    },

    doLogin: (newuser) => {


        return new Promise(async (resolve, reject) => {
            let response = {}
            let user = await db.get().collection(collections.USER_COLLECTION).findOne({ email: newuser.email })
            if (user) {
                bcrypt.compare(newuser.password, user.password).then((status) => {
                    if (status) {
                        console.log('login success')
                        response.user = user
                        response.status = true
                        resolve(response)

                    } else {
                        console.log('login failed')

                        resolve({ status: false })
                    }
                })
            } else {
                console.log('enter signup')
                resolve({ status: false })
            }
        })
    },

    usercart: (prodId, userId) => {
        prodObj = {
            item: objectId(prodId),
            quantity: 1
        }
        return new Promise(async (resolve, reject) => {
            let uId = await db.get().collection(collections.USER_CART).findOne({ user: objectId(userId) })
            if (uId) {
                let existprod = uId.product.findIndex(product => product.item == prodId)
                if (existprod != -1) {
                    db.get().collection(collections.USER_CART).updateOne({ user: objectId(userId), 'product.item': objectId(prodId) }, {
                        $inc: { 'product.$.quantity': 1 }
                    }).then(() => {
                        resolve()
                    })

                } else {


                    db.get().collection(collections.USER_CART).updateOne({ user: objectId(userId) },
                        {
                            $push: {
                                product: objectId(prodObj)
                            }
                        }).then((response) => {
                            resolve(response)
                        })
                }

            } else {
                let cartobj = {
                    user: objectId(userId),
                    product: [prodObj]
                }
                db.get().collection(collections.USER_CART).insertOne(cartobj).then((response) => {
                    resolve(response)
                })
            }
        })
    },
    cartProduct: (userId) => {
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collections.USER_CART).aggregate([
                { $match: { user: objectId(userId) } },
                {
                    $unwind: "$product"
                },
                {
                    $project: {
                        item: '$product.item',
                        quantity: '$product.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collections.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                }

            ]).toArray()

            resolve(cartItems)
        })
    },
    cartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let count = 0
            let cart = await db.get().collection(collections.USER_CART).findOne({ user: objectId(userId) })
            console.log('hei')
            if (cart) {
                count = cart.product.length
                console.log(count)
                resolve(count)

            }
            resolve(count)
        })
    },
    changeQuan: (detailes) => {

        
        let count = parseInt(detailes.count)
        return new Promise((resolve, reject) => {
          
                    db.get().collection(collections.USER_CART).updateOne({ _id: objectId(detailes.cart), 'product.item': objectId(detailes.product) }, {
                        $inc: { 'product.$.quantity': count }
                    }).then(() => {
                        resolve()
                    })
                    

                
            
        })

    }
}

