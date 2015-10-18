var _ = require('lodash');

var charSets = {
    letters: ('qwertyuiopasdfghjklzxcvbnm' + 'йцукенгшщзфывапролджэхъячсмитьбю').split(''),
    digits: ('1234567890').split(''),
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
    }
};