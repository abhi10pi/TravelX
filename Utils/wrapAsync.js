// function wrapAsync(fn){
//     return function(req,res,next){
//        fn(req,res,next).catch(next)
//     }
// }

// const ExpressError = require("./ExpressError")

//OR
module.exports = (fn) => {
    return (req,res,next) => {
       fn(req,res,next).catch(next)
    }
} 