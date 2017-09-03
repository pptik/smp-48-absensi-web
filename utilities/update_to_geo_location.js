function test(collection, callback) {
    collection.find({}).toArray(function (err, locs) {
        if(err) callback(err, null);
        else {
            for(var i = 0; i< locs.length; i++){
                locs[i].index = i;
            }
            locs.forEach(function(index){
                console.log(index);
                console.log("edit : "+index['_id']);
                collection.updateOne({_id: index['_id']},{ $set: { location:{type: 'Point', coordinates:[index['Data'][1], index['Data'][0]]}}}, function(err, result) {
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

function createIndex(collection, callback) {
    collection.createIndex({location:"2dsphere"}, function (err, res) {
        if(err)callback(err, null);
        else callback(null, res);
    });
}


module.exports = {
  test:test,
    createIndex:createIndex
};