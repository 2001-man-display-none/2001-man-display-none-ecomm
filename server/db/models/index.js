const User = require('./user')
const Order = require('./order')
const Product = require('./product')
const OrderItem = require('./order_item')
const Category = require('./category')

/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */

Order.belongsToMany(Product, {through: OrderItem})
Product.belongsToMany(Order, {through: OrderItem})

Order.belongsTo(User)
User.hasMany(Order)

Product.belongsTo(Category)
Category.hasMany(Product)

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */

//User.hasOne(Cart)

module.exports = {
  User,
  Order,
  Product,
  OrderItem,
  Category
}
