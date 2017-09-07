const rmq_config = require('../setup/rmq.json');
const configs=require('../setup/configs.json');
let rmq = require('amqplib');
let request = require('request');


/** connect to rabbit**/
connect = async() => {
    try {
        let connection = await rmq.connect(rmq_config.broker_uri);
        await consume(connection);
    }catch (er){
        console.log(err);
    }
};


/** consume to incoming msg**/
consume = async (connection) => {
    try {
        let channel = await connection.createChannel();
        await channel.assertExchange(rmq_config.exchange_name, 'topic', {durable : true});
        let q = await channel.assertQueue(rmq_config.service_queue_name, {exclusive : false});
        await channel.bindQueue(q.queue, rmq_config.exchange_name, rmq_config.service_route);
        channel.consume(q.queue, (msg) => {
            console.log("=================================================");
            console.log("Incoming msg : "+msg.content.toString());
            console.log(msg.fields.routingKey)
            if(msg.fields.routingKey === rmq_config.route_update_absensi){
               try {
                   let query = JSON.parse(msg.content.toString());
                   console.log("-------------------------------------------------");
                   console.log('Insert Absensi');
                   console.log("-------------------------------------------------");
                   request({
                       url: configs.URL_SERVICE+'absensi/insert',
                       method: "POST",
                       json: true,
                       body: query
                   }, function (error, response, body){
                       console.log(body);
                   });
               }catch (err){
                   console.log(err);
               }
            }
        }, {noAck: true});
        console.log("Service consume on : "+rmq_config.service_route);
    }catch(err) {
        console.log(err);
    }
};


module.exports = {
    connect:connect
};