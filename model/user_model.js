const app = require('../app');
const moment = require('moment');
let database = app.db;
let userCollection = database.collection('users');
let bcyrpt=require('bcrypt-nodejs');
let ObjectId = require('mongodb').ObjectID;

updatePasswordAdmin=(Password)=>{
  return new Promise((resolve,reject)=>{
      let hashedPassword=bcyrpt.hashSync(Password);
      userCollection.updateOne({_id: ObjectId("59a66e42598d9711d0bb64a0")},{ $set:
          {
              Password:hashedPassword
          }
      }, function(err, result) {
          if(err){
              reject(err);
          }else {
              resolve(result);
          }
      });
  });
};
module.exports = {
updatePasswordAdmin:updatePasswordAdmin
};