const app = require('../app');
const moment = require('moment');
let database = app.db;
let userCollection = database.collection('users');
let bcyrpt=require('bcrypt-nodejs');
let salt = bcyrpt.genSaltSync(10);
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
checkLoginUser=(query)=>{
    return new Promise((resolve,reject)=>{
        var Username = new RegExp(["^", query.Entity, "$"].join(""), "i");
        var NoInduk=query.Entity;
       userCollection.findOne({
         $or:[
             {Username:Username},
             {no_induk:NoInduk}
         ]
       },function (err,result) {
           if(err)reject(err);
           else {
               if (result){
                   resolve(result);
               }else {
                   resolve(false);
               }
           }
       });
    });
};
checkIfAdmin=(IDUser)=>{
    return new Promise((resolve,reject)=>{
        userCollection.findOne({
             _id:ObjectId(IDUser)
       },function (err,result) {
           if(err)reject(err);
           else {
               if (result){
                   if(result.RoleID===0){
                       resolve(result);
                   }else {
                       resolve(false);
                   }
               }else {
                   resolve(false);
               }
           }
       });
    });
};
getListSiswa = () => {
    return new Promise((resolve, reject)=>{
        userCollection.find({RoleID:2}).toArray( (err, results) => {
            if(err)reject(err);
            else resolve(results);
        });
    });
};
findUserByString = (SearchString) => {
    return new Promise((resolve, reject)=>{
        console.log(SearchString);
        userCollection.find({
            RoleID:2,
            $text:{
                $search:SearchString
            }
        }).toArray( (err, results) => {
            if(err)reject(err);
            else resolve(results);
        });
    });
};
insertUserSiswa = (query) => {
    return new Promise((resolve, reject)=>{
        let userQuery={
            no_induk:query.NoInduk,
            nama:query.Nama.toUpperCase(),
            jenis_kelamin:query.JenisKelamin,
            RoleID:2,
            Password:bcyrpt.hashSync(query.Password, salt)
        };
        userCollection.insertOne(userQuery,function (err,result) {
           if(err)reject(err);
           else resolve(result);
        });
    });
};
module.exports = {
    updatePasswordAdmin:updatePasswordAdmin,
    checkLoginUser:checkLoginUser,
    getListSiswa:getListSiswa,
    findUserByString:findUserByString,
    checkIfAdmin:checkIfAdmin,
    insertUserSiswa:insertUserSiswa
};