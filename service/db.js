//server - database integration

const mongoose = require('mongoose')

//connect server with mongodb via mongoose
mongoose.connect('mongodb://localhost:27017/Bank', {
    useNewUrlParser: true
})

//create model -(collection Name)
const User = mongoose.model('User', {
    acno: Number,
    username: String,
    password: String,
    balance: Number,
    transaction: []
})



module.exports={
    User
}