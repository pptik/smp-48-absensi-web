const absensiModel = require('../model/absensi_model');
const moment = require('moment');
let id = require('moment/locale/id');

insertUserAbsensi=(query)=>{
    return new Promise(async(resolve, reject) => {
        try{
            console.log(query);
            let MacInCollection= await absensiModel.findMacByMacID(query.mac);
            let today=moment(new Date());
            query.date=new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
            query.tanggal=today.format("dddd, DD/MM/YYYY",'id');
            query.waktu=today.format("HH:mm:ss");
            if(MacInCollection.length>0){
                await absensiModel.insertAbsensi(query);
                req.app.io.emit('absensi', query);
                resolve(true);
            }else {
                await absensiModel.insertToListMac(query.mac);
                await absensiModel.insertAbsensi(query);
                req.app.io.emit('absensi', query);
                resolve(true);
            }
        }catch (err){
            console.log(err);
            reject(err);
        }
    });
};



module.exports = {
    insertUserAbsensi:insertUserAbsensi
};