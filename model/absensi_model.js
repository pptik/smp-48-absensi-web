const app = require('../app');
const moment = require('moment');
let database = app.db;
let macCollection = database.collection('maclist');
let ObjectId = require('mongodb').ObjectID;
let id = require('moment/locale/id');
insertToListMac = (MacID) => {
    return new Promise((resolve, reject)=>{
        macCollection.insertOne({mac:MacID}, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        });
    });
};
insertAbsensi = (query) => {
    return new Promise((resolve, reject)=>{

        database.collection(query.mac).insertOne(query, (err, result) => {
            if(err) reject(err);
            else resolve(result);
        });
    });
};
getListAllMac = () => {
    return new Promise((resolve, reject)=>{
        macCollection.find({}).toArray( (err, results) => {
            if(err)reject(err);
            else resolve(results);
        });
    });
};

findMacByMacID = (MacID) => {
    return new Promise((resolve, reject)=>{
        macCollection.find({mac:MacID}).toArray( (err, results) => {
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
getListAbsenToday = () => {
    return new Promise((resolve, reject)=>{
        macCollection.find({}).toArray( (err, results) => {
            if(err)reject(err);
            else {
                iterateMultipleAbsenList(results,function (err,Listabsen) {
                   if(err)reject(err);
                   else resolve(Listabsen);
                });
            }
        });
    });
};

function getListAbsenTodayByMacID(MacID,callback) {
    var today = new Date();
    today.setHours(0,0,0,0);
    database.collection(MacID).find({
        date:{
            $gte:today
        }
    }).toArray( (err, results) => {
        if(err)callback(err,null);
        else {
            iterateAbsenList(results,function (err,iteratedResult) {
                if(err)callback(err,null);
                else callback(null,iteratedResult);
            });
        }
    });
}

function iterateMultipleAbsenList(items, callback) {
    let arrAbsen=[];
    let maxCount = (items.length > 0) ? items.length-1 : 0;
    let countProccess=0;
    items.forEach(function (indexmac) {
        try {
          getListAbsenTodayByMacID(indexmac.mac,function (err,listAbsen) {
              if(err)callback(err,null);
              else {
                  arrAbsen.push.apply(arrAbsen,listAbsen);
                  if (countProccess === maxCount) {
                      callback(null, arrAbsen);
                  }
                  countProccess++;
              }
          });
        }catch (err){
            callback(err,null);
        }
    });
}
function iterateAbsenList(items, callback) {
    for(let i = 0; i< items.length; i++){
        items[i].index = i;
    }
    let arrResult = [];
    let maxCount = (items.length > 0) ? items.length-1 : 0;
    if(items.length > 0) {
        items.forEach(function (index) {
            var time=moment(index.date);
            index['tanggal']=time.format("dddd, DD/MM/YYYY",'id');
            index['waktu']=time.format("HH:mm:ss");
            arrResult.push(index);
            if (index['index'] == maxCount) {
                for (var i = 0; i < arrResult.length; i++) {
                    delete arrResult[i].index;
                }
                arrResult.sort(compare);
                arrResult = arrResult.filter((arrResult, index, self) => self.findIndex((t) => {return t.rf_id === arrResult.rf_id}) === index)

                callback(null, arrResult);
            }
        });
    }else callback(null, arrResult);
}
function compare(a,b) {
    if (a.date < b.date)
        return -1;
    if (a.date > b.date)
        return 1;
    return 0;
}
module.exports = {
    getListAllMac:getListAllMac,
    getListAbsenByMacID:getListAbsenByMacID,
    getListAbsenByMacIDStartEndTime:getListAbsenByMacIDStartEndTime,
    findMacByMacID:findMacByMacID,
    insertToListMac:insertToListMac,
    insertAbsensi:insertAbsensi,
    getListAbsenToday:getListAbsenToday
};