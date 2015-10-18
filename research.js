'use strict';

var w2v = require('word2vec');


w2v.loadModel(__dirname+ '/output/vectors.txt', function( err, model ) {
    console.log(model);
    var wordVecs = model.getVectors(['молчание', 'голосе']);
    console.log(wordVecs);
    if(wordVecs) {
        console.log( model.getNearestWord(wordVecs[0].values, 1) );
    }

    var similar = model.mostSimilar("молчание", 20);
    console.log(similar);
    //var analogy = model.analogy("woman",["man", "king"], 10);
    //console.log(analogy);
    //var similarity = model.similarity( 'ham', 'cheese' );
    //console.log(similarity);
});