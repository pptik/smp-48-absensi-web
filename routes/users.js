const express = require('express');
const router = express.Router();
const userModel = require('../model/user_model');
let bcyrpt=require('bcrypt-nodejs');

router.post('/updatepasswordadmin', async(req, res) => {
    let requested=req.body;
    console.log(requested);
    if(requested.Password===undefined){
        req.flash('pesan', "Silahkan Isi Password");
        res.render('login', { title: 'Absensi' });
    }else {
        try{
            await userModel.updatePasswordAdmin(requested.Password);
            req.flash('pesan', "Berhasil Mengubah Password");
            res.render('login', { title: 'Absensi' });
        }catch (err){
            console.log(err);
            req.flash('pesan', "Gagal Mengubah Password");
            res.render('login', { title: 'Absensi' });
        }
    }

});
module.exports = router;
