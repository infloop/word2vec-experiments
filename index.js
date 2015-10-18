'use strict';

var w2v = require('word2vec');

w2v.word2phrase(__dirname+'/sentences/sentences.txt', __dirname+ '/output/phrases.txt', {
    threshold:100,
    debug:2,
    minCount: 5,
    silent: false
}, function(err, data) {
    if(err) {
        return console.log(err);
    }
    w2v.word2vec(__dirname+ '/output/phrases.txt', __dirname+ '/output/vectors.txt', {
        cbow:1,
        size: 200,
        window:8,
        negative: 25,
        hs: 0,
        sample:1e-4,
        threads:20,
        iter:15,
        minCount: 5
    },function(err, data) {
        if(err) {
            return console.log(err);
        }
    });
});