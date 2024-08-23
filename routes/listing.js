const express = require('express')
const router = express.Router()
const wrapAsync = require('../Utils/wrapAsync.js')
const Listing = require('../models/listing.js')
const {listingSchema} = require('../schema.js')
const ExpressError = require('../Utils/ExpressError.js')
const {isLoggedIn} = require('../middleware.js')
const {isOwner} = require('../middleware.js')
const multer = require('multer')
const {storage} = require('../cloudConfig.js')
const upload = multer({storage})

const { index } = require('../controllers/listing.js')
const { renderNewForm } = require('../controllers/listing.js')
const { showListing } = require('../controllers/listing.js')
const { createListing } = require('../controllers/listing.js')
const { renderEditForm } = require('../controllers/listing.js')
const { updateListing } = require('../controllers/listing.js')
const { destroyListing } = require('../controllers/listing.js')


const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body)
       
       if(error){
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400,errMsg)
       }else{
        next()
       }
}


//Index route
router.get('/', wrapAsync( index))

//new Route
router.get('/new',isLoggedIn, renderNewForm)

//show route
router.get('/:id', showListing )

//create route
router.post('/',isLoggedIn,upload.single("listing[image]"),wrapAsync(createListing))

//Edit route
router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(renderEditForm ))

//update route
router.put('/:id',isLoggedIn,isOwner,upload.single("listing[image]"),wrapAsync(updateListing))

//delete route
router.delete('/:id',isLoggedIn,isOwner,wrapAsync( destroyListing))

module.exports = router;