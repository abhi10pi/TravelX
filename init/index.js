const mongoose = require('mongoose')
const initData = require('./data.js')
const Listing = require('../models/listing.js')

const MONGO_URL = 'mongodb://localhost:27017/wanderlust'

main().then(()=>{
    console.log('Conected to DB')
}).catch((err)=>{
    console.log(err)
})
async function main(){
    await mongoose.connect(MONGO_URL)
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"66ae2372e0393c732ef41c95"}))
    await Listing.insertMany(initData.data)
    console.log('data is initialize')
}

initDB()
//to connect with database need to run this
