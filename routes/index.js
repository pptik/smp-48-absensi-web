const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', async(req, res) => {
    let Session=req.session;
    if(Session.ID!=null){
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
    if(Session.ID!=null){
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
    if(Session.ID!=null){
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
    if(Session.ID!=null){
        switch (parseInt(Session.RoleID)){
            case 0:
                res.render('authenticated/dashboard-admin', { title: 'Absensi' });
                break
        }
    }else{
        res.render('realtime-absensi', { title: 'Absensi' });
    }
});


module.exports = router;
