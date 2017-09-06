const express = require('express');
const router = express.Router();
const rmq_config = require('../setup/rmq.json');
const config=require('../setup/configs.json');
let rmq = require('amqplib');
/* GET home page. */
router.get('/', async(req, res) => {
    let Session=req.session;
    if(Session._id!==undefined){
        switch (parseInt(Session.RoleID)){
            case 0:
                res.render('authenticated/dashboard-admin', { title: 'Absensi' });
                break
        }
    }else{
        res.render('index', { title: 'Absensi' });
    }
});

router.get('/login', function(req, res, next) {
    let Session=req.session;
    if(Session._id!==undefined){
        switch (parseInt(Session.RoleID)){
            case 0:
                res.render('authenticated/dashboard-admin', { title: 'Absensi' });
                break
        }
    }else{
        res.render('login', { title: 'Absensi' });
    }
});
router.get('/absensilist', function(req, res, next) {
    let Session=req.session;
    if(Session._id!==undefined){
        switch (parseInt(Session.RoleID)){
            case 0:
                res.render('authenticated/dashboard-admin', { title: 'Absensi' });
                break
        }
    }else{
        res.render('absensiview', { title: 'Absensi' });
    }
});
router.get('/realtime', function(req, res, next) {
    let Session=req.session;
    if(Session._id!==undefined){
        switch (parseInt(Session.RoleID)){
            case 0:
                res.render('authenticated/dashboard-admin', { title: 'Absensi',rmq_config:rmq_config,rmq:rmq });
                break
        }
    }else{
        res.render('realtime-absensi', { title: 'Absensi',URL_Service:config.URL_SERVICE });
    }
});
router.get('/authenticated-realtime', function(req, res, next) {
    let Session=req.session;
    if(Session._id!==undefined){
        switch (parseInt(Session.RoleID)){
            case 0:
                res.render('authenticated/realtime-absensi', { title: 'Absensi',URL_Service:config.URL_SERVICE});
                break
        }
    }else{
        res.render('realtime-absensi', { title: 'Absensi',URL_Service:config.URL_SERVICE });
    }
});
router.get('/authenticated-alat-setting', function(req, res, next) {
    let Session=req.session;
    if(Session._id!==undefined){
        switch (parseInt(Session.RoleID)){
            case 0:
                res.render('authenticated/alat-setting', { title: 'Absensi',URL_Service:config.URL_SERVICE});
                break
        }
    }else{
        res.render('index', { title: 'Absensi',URL_Service:config.URL_SERVICE });
    }
});
router.get('/authenticated-data-siswa', function(req, res, next) {
    let Session=req.session;
    if(Session._id!==undefined){
        switch (parseInt(Session.RoleID)){
            case 0:
                res.render('authenticated/data-siswa', { title: 'Absensi',URL_Service:config.URL_SERVICE});
                break
        }
    }else{
        res.render('index', { title: 'Absensi',URL_Service:config.URL_SERVICE });
    }
});



module.exports = router;
