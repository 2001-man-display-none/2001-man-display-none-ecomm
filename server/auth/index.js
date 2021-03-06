const router = require('express').Router()
const {guestsOnly, usersOnly} = require('./privileges')
const User = require('../db/models/user')
module.exports = router

router.post('/login', guestsOnly, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {email: req.body.email.toLowerCase()}
    })
    if (!user) {
      console.log('No such user found:', req.body.email)
      res.status(401).send('Wrong username and/or password')
    } else if (!user.correctPassword(req.body.password)) {
      console.log('Incorrect password for user:', req.body.email)
      res.status(401).send('Wrong username and/or password')
    } else {
      req.login(user, err => (err ? next(err) : res.json(user)))
      if (req.cart) {
        req.cart.saveToUser()
      }
    }
  } catch (err) {
    next(err)
  }
})

router.post('/signup', guestsOnly, async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    req.login(user, err => (err ? next(err) : res.json(user)))
    if (req.cart) {
      req.cart.saveToUser()
    }
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
})

router.put('/editProfile', usersOnly, async (req, res, next) => {
  try {
    const user = req.user
    if (user) {
      const updatedUser = await user.update(req.body)
      res.json(updatedUser)
    }
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
})

router.post('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect('/')
})

router.get('/me', (req, res) => {
  res.json(req.user)
})

router.use('/google', require('./google'))
