'use strict';

var _ = require('lodash');

var charSets = {
    letters: ('qwertyuiopasdfghjklzxcvbnm' + 'йцукенгшщзфывапролджэхъячсмитьбю').split(''),
    digits: ('1234567890').split(''),
    endOfSentence: ['...','.','!!!','!?','?','!'],
    startOfSentence: ['--','-'],
    special: ('!@#$%^&*()_+=-{}[];:\'<>"/?,.№').split(''),
    space: [' ']
};

var splitSymbols = ['...',' - ','--'].concat(charSets.special.concat(charSets.space));

var utils = module.exports =  {

    /**
     * Charsers for use
     */
    charSets:charSets,


    /**
     * Searches array of needles in string
     * only from left(only from 0 position)
     *
     * @param {string} string
     * @param {Array.<string>|Array.<RegExp>} needles
     * @returns {Object|Boolean}
     */
    lsearch: function (string, needles) {

        // first sort needles by length
        var sorted = _.sortBy(needles, function (needle) {
            if (needle instanceof RegExp) {
                return 10;
            }
            return needle.length * (-1);
        });

        // searching...
        for (var i = 0; i < sorted.length; i++) {
            var match = [];
            if ((sorted instanceof RegExp) && !_.isNull(match = needles.match(sorted[i]))) {
                return { index: needles.indexOf(sorted[i]), len: match[0].length};
            }

            if (string.indexOf(sorted[i]) === 0) {
                return { index: needles.indexOf(sorted[i]), len: sorted[i].length};
            }
        }
        return false;
    },

    /**
     * Splits a string by separators
     * with separators included in
     * result array
     *
     * @param {string} string
     * @param {Array.<string>|Array.<RegExp>} separators
     * @returns {Array}
     */
    splitKeep: function (string, separators) {
        var buffer = [];
        var temp = '';
        var hasLastSplit = false;
        var source = string + ' ';
        var pos = 0;
        var len = 0;
        var res = {};
        while (true) {
            if (hasLastSplit) {
                buffer.push(temp);
                temp = '';
                hasLastSplit = false;
            }

            if ((res = this.lsearch(source.substr(pos), separators)) !== false) {
                len = res.len;

                if (temp)
                    buffer.push(temp);
                temp = '';
                temp += source.substr(pos, len);
                hasLastSplit = true;
                pos += len;
            } else {
                temp += source[pos];
                pos++;
            }

            if (pos > source.length - 1)
                break;
        }
        return buffer;
    },

    /**
     *
     * @param {String} text
     * @returns {Array<String>}
     */
    splitIntoSentences: function(text) {
        var chunks = this.splitKeep(text, splitSymbols);

        var last = null;
        chunks = _.filter(chunks, function(chunk) {
            var res = (chunk == ' ') || (chunk == ',') || (chunk == ':');
            last = chunk;
            return !res;
        });

        var sentences = [];
        var sentence = [];
        _.map(chunks ,function(chunk, i) {
            sentence.push(chunk);
            if(chunk == '.' ||
                chunk == '?' ||
                chunk == '...' ||
                chunk == '!' &&
                (chunks[i+1] && chunks[i+1].charAt(0) == chunks[i+1].charAt(0).toUpperCase())
            ) {
                sentences.push(sentence);
                sentence = [];
            }
        });

        return sentences;
    },

    /**
     *
     * @param {Array<String>} sentence
     * @returns {boolean}
     */
    isSimpleSentence: function(sentence) {
        if(!sentence) return false;
        if(!sentence.length) return false;

        let simple = true;
        for(let i=0; i<  sentence.length; i++) {
            let word = sentence[i];
            if(word.length == 1 && charSets.special.indexOf(word) >=0) {
                simple = false;
            } else if(word.length == 3 && splitSymbols.indexOf(word) >=0) {
                simple = false;
            }
        }

        return simple;
    },

    /**
     *
     * @param {Array<String>} sentence
     * @returns {Array<String>}
     */
    cleanSentence: function(sentence) {
        var newSentence = [];
        for(let i=0; i<sentence.length; i++) {
            let word = sentence[i];
            if(i==0) {
                word = word.toLowerCase();
            }

            if(i == 0 && charSets.startOfSentence.indexOf(word) >=0) {

            } else if(i == (sentence.length -1) && charSets.endOfSentence.indexOf(word) >=0) {

            } else {
                newSentence.push(word);
            }
        }

        return newSentence;
    }
};