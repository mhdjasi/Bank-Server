//server creation

//1. import express
const { response } = require('express')
const express = require('express')
//import jsonwebtoken
const jwt = require("jsonwebtoken")

//dataservice
const dataService = require('./service/data.service')

//2. create server app
const app = express()

//to parse JSON
app.use(express.json())

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


//3. HTTP request resolve

//GET Request - to read data
// app.get('/', (req, res) => {
//     res.send('GET METHOD')
// })

//POST Request - to create data
// app.post('/', (req, res) => {
//     res.send('POST METHOD')
// })

//PUT Request - to update data completely
// app.put('/', (req, res) => {
//     res.send('PUT METHOD')
// })

//PATCH Request - to update data partially
// app.patch('/', (req, res) => {
//     res.send('PATCH METHOD')
// })

//DELETE Request - to remove data 
// app.delete('/', (req, res) => {
//     res.send('DELETE METHOD')
// })








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
    const result = dataService.deposit(req.body.acno,req.body.pswd,req.body.amt)
    res.status(result.statusCode).json(result)
})
//withdraw api
app.post('/withdraw',jwtMiddleware, (req, res) => {
    console.log(req.body);
    const result = dataService.withdraw(req.body.acno,req.body.pswd,req.body.amt)
    res.status(result.statusCode).json(result)
})
//transaction api
app.post('/transaction',jwtMiddleware, (req, res) => {
    console.log(req.body);
    try{
        const result = dataService.getTransaction(req.body.acno)
        res.status(result.statusCode).json(result)
    }
    catch{
        res.status(422).json({
            statusCode: 422,
            status: false,
            message: 'Empty Transaction'
          })
    }
})


//4. set up port number
app.listen(3000, () => {
    console.log('Server started at port 3000');
})
