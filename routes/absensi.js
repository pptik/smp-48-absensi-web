const express = require('express');
const router = express.Router();
const userModel = require('../model/user_model');
const absensiModel = require('../model/absensi_model');
let bcyrpt=require('bcrypt-nodejs');

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
module.exports = router;
