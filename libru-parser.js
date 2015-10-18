var async = require('async');
var request = require('request');
var Iconv = require('iconv').Iconv;
var _ = require('lodash');
var utils = require('./utils');
var striptags = require('striptags');
var charsetDetector = require("node-icu-charset-detector");
var host = 'http://lib.ru';

module.exports = {
    parse: parse
};

function parse(author, title, cb) {

    request({
        url: host +'/'+ author +'/'+ title,
        headers: {
            'Accept': 'text/html;charset=UTF-8',
            'Accept-Charset': 'UTF-8'
        },
        encoding: 'binary'
    }, function (error, response, body) {
        body = new Buffer(body, 'binary');

        if (!error && response.statusCode === 200) {

            var charset = charsetDetector.detectCharset(body);

            var conv = new Iconv(charset.toString(), 'utf8');
            var text = conv.convert(body).toString();

            text = text.replace('---------------------------------------------------------------','');

            text = striptags(text);

            text = text.replace(/\n/ig,' ');

            var sentences = utils.splitIntoSentences(text);

            cb(null, sentences);
        } else {
            if (!error) {
                error = new Error('HTTP status '+ response.statusCode);
            }
            cb(error);
        }
    });
};

