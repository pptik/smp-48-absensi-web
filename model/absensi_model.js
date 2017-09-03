const app = require('../app');
const moment = require('moment');
let database = app.db;
let macCollection = database.collection('maclist');
let ObjectId = require('mongodb').ObjectID;
let id = require('moment/locale/id');
getListAllMac = () => {
    return new Promise((resolve, reject)=>{
        macCollection.find({}).toArray( (err, results) => {
            if(err)reject(err);
            else resolve(results);
        });
    });
};
getListAbsenByMacID = (MacID) => {
    return new Promise((resolve, reject)=>{
        database.collection(MacID).find().toArray( (err, results) => {
            if(err)reject(err);
            else {
                iterateAbsenList(results,function (err,iteratedResult) {
                   if(err)reject(err)
                   else resolve(iteratedResult);
                });
            }
        });
    });
};
getListAbsenByMacIDStartEndTime = (MacID,StartTime,EndTime) => {
    return new Promise((resolve, reject)=>{
        database.collection(MacID).find({
            date:{
                $gte:new Date(StartTime),
                $lt:new Date(EndTime)
            }
        }).toArray( (err, results) => {
            console.log(results)
            if(err)reject(err);
            else {
                iterateAbsenList(results,function (err,iteratedResult) {
                   if(err)reject(err);
                   else resolve(iteratedResult);
                });
            }
        });
    });
};
function iterateAbsenList(items, callback) {
    for(let i = 0; i< items.length; i++){
        items[i].index = i;
    }
    let arrResult = [];
    let maxCount = (items.length > 0) ? items.length-1 : 0;
    if(items.length > 0) {
        items.forEach(function (index) {
            var time=moment(index.date);
            index['tanggal']=time.format("dddd, MM/DD/YYYY",'id');
            index['waktu']=time.format("HH:mm:ss");
            arrResult.push(index);
            if (index['index'] == maxCount) {
                for (var i = 0; i < arrResult.length; i++) {
                    delete arrResult[i].index;
                }
                callback(null, arrResult);
            }
        });
    }else callback(null, arrResult);
}
module.exports = {
    getListAllMac:getListAllMac,
    getListAbsenByMacID:getListAbsenByMacID,
    getListAbsenByMacIDStartEndTime:getListAbsenByMacIDStartEndTime
};