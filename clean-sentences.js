var async = require('async');
var fs = require('fs');
var Promise = require("bluebird");
var co = require("co");
var utils = require('./utils');
var _ = require('lodash');

var path = './files/';
var storeFile = './sentences/sentenses.json';

var totalCount = 0;
var totalSentences = [];
fs.readdir(path, function(err, files) {
   async.eachSeries(files, function(filename, cb) {
      fs.readFile(path + filename, { encoding: "utf8" }, function(err, data) {
          if(err) { return cb(err); }

          var sentences = JSON.parse(data);
          var cleanedSentences = [];

          sentences = _.map(sentences, function(sentence) {
              sentence = utils.cleanSentence(sentence);

              if(utils.isSimpleSentence(sentence)) {
                  cleanedSentences.push(sentence);
              }
          });

          totalSentences = totalSentences.concat(cleanedSentences);
          cb();
      });
   }, function() {
       console.log(totalSentences.length);
       var text = '';
       _.map(totalSentences, function(sentence) {
           text += sentence.join(' ') + String.fromCharCode(13);
       });

       fs.appendFile(storeFile, text, { encoding: "utf8" }, function(err, ok) {

       });
   });
});
