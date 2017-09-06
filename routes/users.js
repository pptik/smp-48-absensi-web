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
router.post('/login/action', async(req, res) => {
    let sess=req.session;
    let requested=req.body;
    console.log(requested);
    if(requested.Password===undefined||requested.Entity===undefined){
        req.flash('pesan', "Silahkan Isi Username dan Password");
        res.render('login', { title: 'Absensi' });
    }else {
        try{
            let checklogin= await userModel.checkLoginUser(requested);
            console.log(checklogin);
            if(checklogin){
                let passwordFromDb=checklogin.Password;
                if(passwordFromDb!==undefined){
                    if(bcyrpt.compareSync(requested.Password,passwordFromDb)){
                        sess.Username=requested.Entity;
                        sess.NoInduk=requested.Entity;
                        sess.RoleID=checklogin.RoleID;
                        sess.Nama=checklogin.nama;
                        sess._id=checklogin._id;
                        console.log(sess);
                        req.flash('pesan', "Berhasil Login");
                        res.redirect('/');
                    }else {
                        req.flash('pesan', "Gagal Login Username Atau Password Salah");
                        res.render('login', { title: 'Absensi' });
                    }
                }else {
                    req.flash('pesan', "Akun Belum Aktif");
                    res.render('login', { title: 'Absensi' });
                }
            }else {
                req.flash('pesan', "Anda Tidak Terdaftar");
                res.render('login', { title: 'Absensi' });
            }
        }catch (err){
            console.log(err);
            req.flash('pesan', "Gagal Login");
            res.render('login', { title: 'Absensi' });
        }
    }
});
router.get('/list/siswa', async(req, res) => {
    try{
        let listSiswa=await userModel.getListSiswa();
            res.status(200).send({success: true, message: "Data Berhasil Diambil",listsiswa:listSiswa});
    }catch (err){
        console.log(err);
        res.status(200).send({success: false, message: "Data Gagal Diambil"});
    }
});
router.post('/search/siswa', async(req, res) => {
    console.log(req.body);
    try{
        if (req.body.SearchString===""){
            let listSiswa=await userModel.getListSiswa();
            res.status(200).send({success: true, message: "Data Berhasil Diambil",listsiswa:listSiswa});
        }else {
            let listSiswa=await userModel.findUserByString(req.body.SearchString);
            res.status(200).send({success: true, message: "Data Berhasil Diambil",listsiswa:listSiswa});
        }

    }catch (err){
        console.log(err);
        res.status(200).send({success: false, message: "Data Gagal Diambil"});
    }
});
router.get('/logout/action', async(req, res) => {
    let sess=req.session;
    delete sess._id;
    res.render('login', { title: 'Absensi' });
});
module.exports = router;
