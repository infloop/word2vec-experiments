var libruparser = require('./libru-parser');
var async = require('async');
var fs = require('fs');

var author = 'LUKXQN';
var titles = [
    //'posol.txt',
    //'rainbow.txt',
    //'expert.txt'
    'lukian49.txt'
];

var totalSentences = 0;

async.eachSeries(titles, function(title, cb) {
    libruparser.parse(author, title, function(err, res) {
        if(err) {
           return cb(err);
        }
        totalSentences += res.length|0;

        return fs.writeFile('./files/'+author+'_'+title+'_sentences.json', JSON.stringify(res,null, 1), cb);
    });
}, function() {
    console.log({totalSentences:totalSentences});
});

