const express = require('express');
const router = express.Router();
const userModel = require('../model/user_model');
const absensiModel = require('../model/absensi_model');
let bcyrpt=require('bcrypt-nodejs');
const moment = require('moment');
let id = require('moment/locale/id');

router.get('/list/mac', async(req, res) => {
    try{
        let listMacList=await absensiModel.getListAllMac();
        res.status(200).send({success: true, message: "Data Berhasil Diambil",listmac:listMacList});
    }catch (err){
        console.log(err);
        res.status(200).send({success: false, message: "Data Gagal Diambil"});
    }
});
router.post('/list/absen/by/mac', async(req, res) => {
    try{
        let listabsen=await absensiModel.getListAbsenByMacID(req.body.MacID);
        res.status(200).send({success: true, message: "Data Berhasil Diambil",list:listabsen});
    }catch (err){
        console.log(err);
        res.status(200).send({success: false, message: "Data Gagal Diambil"});
    }
});
router.post('/list/absen/by/mac/starttime/endtime', async(req, res) => {
    let query=req.body;
    console.log(query)
    try{
        let listabsen=await absensiModel.getListAbsenByMacIDStartEndTime(query.MacID,query.StartTime,query.EndTime);
        res.status(200).send({success: true, message: "Data Berhasil Diambil",list:listabsen});
    }catch (err){
        console.log(err);
        res.status(200).send({success: false, message: "Data Gagal Diambil"});
    }
});
router.post('/insert', async(req, res) => {
    let query=req.body;
    if (query.mac===undefined||query.rf_id===undefined)res.status(200).send({success: false, message: "Parameter tidak Lengkap"});
    else {
        try{
            let MacInCollection= await absensiModel.findMacByMacID(query.mac);
            let today=moment(new Date());
            query.date=new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
            query.tanggal=today.format("dddd, DD/MM/YYYY",'id');
            query.waktu=today.format("HH:mm:ss");
            if(MacInCollection.length>0){
                await absensiModel.insertAbsensi(query);
                req.app.io.emit('absensi', query);
                res.status(200).send({success: true, message: "Data Berhasil Dikirim"});
            }else {
                await absensiModel.insertToListMac(query.mac);
                await absensiModel.insertAbsensi(query);
                req.app.io.emit('absensi', query);
                res.status(200).send({success: true, message: "Data Berhasil Dikirim"});
            }
        }catch (err){
            console.log(err);
            res.status(200).send({success: false, message: "Data Gagal Diambil"});
        }
    }

});
router.get('/today/list', async(req, res) => {
    try{
        let listMacList=await absensiModel.getListAbsenToday();
        res.status(200).send({success: true, message: "Data Berhasil Diambil",listmac:listMacList});
    }catch (err){
        console.log(err);
        res.status(200).send({success: false, message: "Data Gagal Diambil"});
    }
});
router.get('/test', async(req, res) => {
    req.app.io.emit('absensi', 'tessssss');
    res.status(200).send({success: false, message: "Data Gagal Diambil"});
});

module.exports = router;
