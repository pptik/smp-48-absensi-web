
function convert(db, collectionName) {
    return new Promise(function (resolve, reject) {
        var collection = db.collection(collectionName);
        collection.find({}).toArray(function (err, docs) {
            if(err)reject(err);
            else {
                console.log('converting to iso ....', 'Length : ' + docs.length);
                for (var i = 0; i < docs.length; i++) {
                    docs[i].index = i;
                }
                docs.forEach(function (index) {
                    collection.updateOne(
                        {"_id": index._id},
                        {"$set": {"Times": new Date(index['Times']), "Exp": new Date(index['Exp'])}}, function (err, res) {
                            if(err)reject(err);
                            else {
                                if(index['index'] == docs.length-1){
                                    resolve('success converting');
                                }
                                else {

                                }
                            }
                        }
                    );
                });
            }
        });
    });
}

module.exports = {
    convert:convert
};
