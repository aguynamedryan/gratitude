var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

GratitudeProvider = function(host, port) {
  this.db= new Db('node-mongo-gratitude', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


GratitudeProvider.prototype.getCollection= function(callback) {
  this.db.collection('gratitudes', function(error, gratitude_collection) {
    if( error ) callback(error);
    else callback(null, gratitude_collection);
  });
};

//find all gratitudes
GratitudeProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, gratitude_collection) {
      if( error ) callback(error)
      else {
        gratitude_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//save new gratitude
GratitudeProvider.prototype.save = function(gratitudes, callback) {
    this.getCollection(function(error, gratitude_collection) {
      if( error ) callback(error)
      else {
        if( typeof(gratitudes.length)=="undefined")
          gratitudes = [gratitudes];

        for( var i =0;i< gratitudes.length;i++ ) {
          gratitude = gratitudes[i];
          gratitude.created_at = new Date();
        }

        gratitude_collection.insert(gratitudes, function() {
          callback(null, gratitudes);
        });
      }
    });
};

exports.GratitudeProvider = GratitudeProvider;
