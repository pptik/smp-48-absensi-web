const express = require('express');
const router = express.Router();
const userModel = require('../model/user_model');
let bcyrpt=require('bcrypt-nodejs');

router.post('/delete-user', async(req, res) => {
    let query=req.body;
    console.log(query);
    if (query.PasswordAdmin===undefined||query._idDelete===undefined){
        req.flash('pesan', "Silahkan Lengkapi Data");
        res.redirect('/authenticated-data-siswa');
    }
    else {
        try{
            let checkadmin= await userModel.checkIfAdmin(req.session._id);
            if(checkadmin){
                let passwordFromDb=checkadmin.Password;
                if(passwordFromDb!==undefined){
                    if(bcyrpt.compareSync(query.PasswordAdmin,passwordFromDb)){
                        await userModel.deleteUserFromDocument(query._idDelete);
                        req.flash('pesan', "Berhasil Menghapus data");
                        res.redirect('/authenticated-data-siswa');
                    }else {
                        req.flash('pesan', "Password Salah");
                        res.redirect('/authenticated-data-siswa');
                    }
                }else {
                    req.flash('pesan', "Akun Belum Aktif");
                    res.redirect('/authenticated-data-siswa');
                }
            }else {
                req.flash('pesan', "Gagal Meghapus Data");
                res.redirect('/authenticated-data-siswa');
            }

        }catch (err){
            console.log(err);
            req.flash('pesan', "Gagal Meghapus Data");
            res.redirect('/authenticated-data-siswa');
        }
    }

});
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
router.post('/insert/siswa', async(req, res) => {
    let query=req.body;
    console.log(query);
    if(query.NoInduk===undefined||query.Nama===undefined||query.JenisKelamin===undefined||query.Password===undefined){
        req.flash('pesan', "Gagal Menambah Data");
        res.redirect('/authenticated-data-siswa');
    }else {
        try{
            await userModel.insertUserSiswa(query);
            req.flash('pesan', "Berhasil Menambah Data");
            res.redirect('/authenticated-data-siswa');
        }catch (err){
            console.log(err);
            req.flash('pesan', "Gagal Menambah Data");
            res.redirect('/authenticated-data-siswa');
        }
    }
});
router.post('/edit/siswa', async(req, res) => {
    let query=req.body;
    console.log(query);
    if(query._idEdit===undefined||query.NoIndukEdit===undefined||query.NamaEdit===undefined||query.JenisKelaminEdit===undefined){
        req.flash('pesan', "Gagal Mengubah Data");
        res.redirect('/authenticated-data-siswa');
    }else {
        try{
            await userModel.updateUserSiswa(query);
            req.flash('pesan', "Berhasil Mengubah Data");
            res.redirect('/authenticated-data-siswa');
        }catch (err){
            console.log(err);
            req.flash('pesan', "Gagal Mengubah Data");
            res.redirect('/authenticated-data-siswa');
        }
    }
});
router.post('/insert/rfid', async(req, res) => {
    let query=req.body;
    console.log(query);
    if(query.RFID===undefined||query._id===undefined||query.RFID===""){
        req.flash('pesan', "Silahkan Masukan Kartu Yang Valid");
        res.redirect('/authenticated-data-siswa');
    }else {
        try{
            let checkRFID=await userModel.checkRFID(query.RFID);
            if(!checkRFID){
                await userModel.updateRfidSiswa(query);
                req.flash('pesan', "Data Berhasil Ditambahkan");
                res.redirect('/authenticated-data-siswa');
            }else {
                req.flash('pesan', "Kartu RFID Sudah digunakan user lain, silahkan coba kartu yang lain");
                res.redirect('/authenticated-data-siswa');
            }

        }catch (err){
            console.log(err);
            req.flash('pesan', "Gagal Mengupdate Data");
            res.redirect('/authenticated-data-siswa');
        }
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
