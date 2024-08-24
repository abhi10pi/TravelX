 if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}
// console.log(process.env.SECRETE)//whatever the value is store in .env can access

const express=require('express')
const app=express()
const mongoose=require('mongoose')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./Utils/ExpressError.js')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')

const listingRouter = require('./routes/listing.js')
const reviewRouter = require('./routes/review.js')
const userRouter = require('./routes/user.js')

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,"/Public")))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine('ejs',ejsMate)



const dbUrl = 'mongodb+srv://abhishekpimpalkar35:12wanderlust@cluster0.6ugmpsk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'


main().then(()=>{
    console.log('connected')
}).catch((err)=>{
    console.log(err)
})
async function main(){
    await mongoose.connect(dbUrl)
}

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600

})

store.on("error",()=>{
      console.log("ERROR in MONGO SESSION STORE",err)
})

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized : true,
    cookie:{
        expires : Date.now() + 7 * 24 * 60 * 60 *1000,
        maxAge : 7 * 24 * 60 * 60 *1000,
        httpOnly : true
    }
}

// app.get('/',(req,res)=>{
//     res.send('its working')
// })



app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currUser = req.user
    next()
})

// app.get('/demouser',async (req,res)=>{
//     let fakeUser = new User({
//         email:"abhi@123",
//         username:"abhi_01",
//     })
//     let registerUser = await User.register(fakeUser,"abhi@123")
//     res.send(registerUser)  
// })


app.use('/listings',listingRouter)
app.use('/listings/:id/reviews',reviewRouter)
app.use('/',userRouter)


//when no page found
app.all('*',(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"))
})

// Middleware for error handeling
app.use((err,req,res,next)=>{
    let {statusCode="404",message="Its not yet"} = err
    // console.log("error")
    // res.se('its not working')
    // res.status(statusCode).send(message)
    res.render('./listings/error.ejs',{message})
})

app.listen(3000,()=>{
    console.log('server listening on port no 3000')
})