//server creation

//1. import express
const express = require('express')

//import jsonwebtoken
const jwt = require("jsonwebtoken")

//import cors
const cors = require('cors')

//dataservice
const dataService = require('./service/data.service')

//2. create server app
const app = express()

//to parse JSON
app.use(express.json())

// to use cors to share data with others
app.use(cors({
    origin:'http://localhost:4200'
}))

//Application Specific Middleware

// const appMiddleware = (req,res,next)=>{
    // console.log('Application Specific Middleware');
    // next()
// }
// app.use(appMiddleware)



//Router Specific Middleware - Token validate
const jwtMiddleware = (req,res,next)=>{
   try {
    console.log('Router Specific Middleware');
    const token = req.headers['x-access-token']
    const data = jwt.verify(token,"supersecretkey12345")
    console.log(data);
    next()
}
catch{
    res.status(422).json({
      statusCode: 422,
      status: false,
      message: 'Please Login'
    })
}
}










//Bank App Request Resolving

//register api
app.post('/register', (req, res) => {
    console.log(req.body);
    dataService.register(req.body.acno,req.body.password,req.body.username)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
    
})
//login api
app.post('/login', (req, res) => {
    console.log(req.body);
    dataService.login(req.body.acno,req.body.pswd)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})


//deposit api
app.post('/deposit',jwtMiddleware, (req, res) => {
    console.log(req.body);
    dataService.deposit(req.body.acno,req.body.pswd,req.body.amt)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})
//withdraw api
app.post('/withdraw',jwtMiddleware, (req, res) => {
    console.log(req.body);
    dataService.withdraw(req.body.acno,req.body.pswd,req.body.amt)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})
//transaction api
app.post('/transaction',jwtMiddleware, (req, res) => {
    console.log(req.body);
    try{
        dataService.getTransaction(req.body.acno)
        .then(result=>{
            res.status(result.statusCode).json(result)
        })
    }
    catch{
        res.status(422).json({
            statusCode: 422,
            status: false,
            message: 'Empty Transaction'
          })
    }
})

//onDelete api
app.delete('/onDelete:acno',(req,res)=>{
    dataService.onDelete(req.params.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})


//4. set up port number
app.listen(3000, () => {
    console.log('Server started at port 3000');
})
