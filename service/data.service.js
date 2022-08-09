
//for request logic

//import jsonwebtoken
const jwt = require("jsonwebtoken")

//import db 
const db = require('./db')

// data base
userDetails = {
  1000: { acno: 1000, username: 'Neer', password: 1000, balance: 5000, transaction: [] },
  1001: { acno: 1001, username: 'Laisha', password: 1001, balance: 6000, transaction: [] },
  1002: { acno: 1002, username: 'Vyom', password: 1002, balance: 4000, transaction: [] }
}


//Register
const register = (acno, password, username) => {
  //asynchronus
  return db.User.findOne({ acno })
    .then(user => {
      if (user) {
        return {
          statusCode: 401,
          status: false,
          message: 'User already Exist... Please Log In'
        }
      }
      else {
        const newUser = new db.User({
          acno,
          username,
          password,
          balance: 0,
          transaction: []
        })
        newUser.save()
        return {
          statusCode: 200,
          status: true,
          message: 'Successfully register'
        }
      }
    })

  // if (acno in userDetails) {
  //   return {
  //     statusCode: 401,
  //     status: false,
  //     message: 'User already Exist... Please Log In'
  //   }
  // }
  // else {
  //   userDetails[acno] = {
  //     acno,
  //     username,
  //     password,
  //     balance: 0,
  //     transaction: []
  //   }
  //   console.log(userDetails);
  //   return {
  //     statusCode: 200,
  //     status: true,
  //     message: 'Successfully register'
  //   }

  // }
}

//login()
const login = (acno, pswd) => {
  //asynchronous
return db.User.findOne({
  acno,
  password:pswd
})
.then(user=>{
  if(user){
    currentUsername = user.username
    currentAcno = acno

    //token generation using jwt
    const token = jwt.sign({
      currentAcno: acno
    }, "supersecretkey12345")

    return {
      statusCode: 200,
      status: true,
      message: 'Login Successfully ',
      currentUsername,
      currentAcno,
      token
    }

  }
  else{
    return {
      statusCode: 401,
      status: false,
      message: 'Incorrect account number / password'
    }
  }
})
  // if (acno in userDetails) {
  //   if (pswd == userDetails[acno]['password']) {
  //     currentUsername = userDetails[acno]['username']
  //     currentAcno = acno

  //     //token generation using jwt
  //     const token = jwt.sign({
  //       currentAcno: acno
  //     }, "supersecretkey12345")

  //     return {
  //       statusCode: 200,
  //       status: true,
  //       message: 'Login Successfully ',
  //       currentUsername,
  //       currentAcno,
  //       token
  //     }
  //   }
  //   else {
  //     return {
  //       statusCode: 401,
  //       status: false,
  //       message: 'incorrect password'
  //     }
  //   }

  // }
  // else {
  //   return {
  //     statusCode: 401,
  //     status: false,
  //     message: 'User doesnot exist'
  //   }
  // }
  
}

//deposit
const deposit = (acno, pswd, amt) => {
  var amount = parseInt(amt)
  if (acno in userDetails) {
    if (pswd == userDetails[acno]['password']) {
      userDetails[acno]['balance'] += amount
      userDetails[acno]['transaction'].push({
        type: 'CREDIT',
        amount
      })
      console.log(userDetails);
      return {
        statusCode: 200,
        status: true,
        message: `${amt} credited. New balance is ${userDetails[acno]['balance']}`
      }
    }
    else {
      return {
        statusCode: 401,
        status: false,
        message: 'incorrect password'
      }
    }
  }
  else {
    return {
      statusCode: 401,
      status: false,
      message: 'User doesnot exist'
    }
  }
}

//withdraw
const withdraw = (acno, pswd, amt) => {
  var amount = parseInt(amt)
  if (acno in userDetails) {
    if (pswd == userDetails[acno]['password']) {
      if (userDetails[acno]['balance'] > amount) {
        userDetails[acno]['balance'] -= amount
        userDetails[acno]['transaction'].push({
          type: 'DEBIT',
          amount
        })
        console.log(userDetails);
        return {
          statusCode: 200,
          status: true,
          message: `${amt} debitted. New balance is ${userDetails[acno]['balance']}`
        }

      }
      else {
        return {
          statusCode: 401,
          status: false,
          message: 'Insufficient Blalance'
        }
      }

    }
    else {
      return {
        statusCode: 401,
        status: false,
        message: 'incorrect password'
      }
    }
  }
  else {
    return {
      statusCode: 401,
      status: false,
      message: 'User doesnot exist'
    }
  }

}


//transaction 
const getTransaction = (acno) => {
  return {
    statusCode: 200,
    status: true,
    transaction: userDetails[acno]['transaction']
  }
}


//to export 
module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransaction

}

