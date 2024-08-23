const express = require('express')
const router = express.Router({mergeParams:true})
const wrapAsync = require('../Utils/wrapAsync.js')
const Review = require('../models/review.js')
const Listing = require('../models/listing.js')
const {reviewSchema} = require('../schema.js')
const ExpressError = require('../Utils/ExpressError.js')
const { isLoggedIn, isReviewAuthor} = require('../middleware.js')

const {createReview }= require('../controllers/review.js')
const {destroyReview }= require('../controllers/review.js')

const validateReview = (req,res,next)=>{
  let {error} = reviewSchema.validate(req.body)
     
     if(error){
      let errMsg = error.details.map((el) => el.message).join(",")
      throw new ExpressError(400,errMsg)
     }else{
      next()
     }
}

router.post('/',isLoggedIn, wrapAsync(createReview))
  
//Review delete route
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(destroyReview))

module.exports=router