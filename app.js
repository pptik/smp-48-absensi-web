var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var database = require('./setup/database');
var session = require('express-session');
var debug = require('debug')('SMP48-absensi:website');
var http = require('http');
var flash = require('express-flash')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash())
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: "absensiSMP48",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: !true }
}));


database.connect(function (err, db) {
    if(err){
        console.log(err);
    } else {
        app.use(function (req, res, next) {
            res.locals.messages = require('express-messages')(req, res);
            next();
        });
        app.use(function(err, req, res, next) {
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            res.status(err.status || 500);
            res.render('error');
        });
        var port = normalizePort(process.env.PORT || '3051');
        app.set('port', port);
        var server = http.createServer(app);
        server.listen(port);
        server.on('error', onError);
        server.on('listening', onListening);
        var io = require('socket.io').listen(server);
        function normalizePort(val) {
            var port = parseInt(val, 10);
            if (isNaN(port)) {
                return val;
            }
            if (port >= 0) {
                return port;
            }
            return false;
        }

        function onError(error) {
            if (error.syscall !== 'listen') {
                throw error;
            }

            var bind = typeof port === 'string'
                ? 'Pipe ' + port
                : 'Port ' + port;

            switch (error.code) {
                case 'EACCES':
                    console.error(bind + ' requires elevated privileges');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(bind + ' is already in use');
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        }

        function onListening() {
            var addr = server.address();
            var bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
            debug('Listening on ' + bind);
        }

        io.on('connection', function(socket){
            console.log('a user connected');
            socket.on('disconnect', function(){
                console.log('user disconnected');
            });
        });
        app.io = io;
        app.db = db;
        module.exports = app;
        const rmqConnection = require('./rmq/connection');
        rmqConnection.connect();
        var index = require('./routes/index');
        var users = require('./routes/users');
        var absensi = require('./routes/absensi');


        app.use('/', index);
        app.use('/users', users);
        app.use('/absensi', absensi);



        app.use(function(req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });
    }
});
module.exports = app;