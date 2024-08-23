const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const wrapAsync = require('../Utils/wrapAsync')
const passport = require('passport')
const { saveRedirectUrl } = require('../middleware.js')

const {signup, renderSignupForm,renderLoginForm,login,logout} = require('../controllers/user.js')

//Signup
router.get('/signup',renderSignupForm)

router.post('/signup',wrapAsync(signup))

//LoginFirn
router.get('/login',renderLoginForm)

//Login
router.post('/login',saveRedirectUrl,
    passport.authenticate("local",
    {failureRedirect:'/login',failureFlash:true}),login)

//logOut
router.get('/logout',logout)

module.exports = router