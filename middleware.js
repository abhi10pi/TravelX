const Listing = require('./models/listing')
const Review  = require('./models/review.js')
const {listingSchema,reviewSchema} = require('./schema.js')
const ExpressError = require('./Utils/ExpressError.js')


module.exports.isLoggedIn = (req,res,next) => {
   
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listings")
        return res.redirect('/login')
       }
       next()
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}

module.exports.isOwner = async (req,res,next) =>{
    let { id } = req.params
    let listing = await Listing.findById(id)
    if(!listing.owner.equals(res.locals.currUser.id)){
        req.flash("error","you are not the owner of this listing")
       return  res.redirect(`/listings/${id}`)
    }
    next()

}

module.exports.isReviewAuthor = async (req,res,next)=>{
    let {reviewId,id} = req.params
    let reviewg= await Review.findById(reviewId)
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not author")
        return res.redirect(`/listings/${id}`)
    }
    next()

}
