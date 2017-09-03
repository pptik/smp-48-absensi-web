function test(collection, callback) {
    collection.find({}).toArray(function (err, locs) {
        if(err) callback(err, null);
        else {
            for(var i = 0; i< locs.length; i++){
                locs[i].index = i;
            }
            locs.forEach(function(index){
                console.log(index['_id']);
                collection.updateOne({_id: index['_id']},{ $set: { NotificationToken: ""}}, function(err, result) {
                    if(err){
                        callback(err, null);
                    }else {
                        if(index['index'] == locs.length-1) {
                            callback(null, "success");
                        }
                    }
                });

            });

        }
    });
}


module.exports = {
    test:test
};