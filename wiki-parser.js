var bot = require('nodemw');

// pass configuration object
var client = new bot({
    server: 'ru.wikipedia.org',  // host name of MediaWiki-powered site
    path: '/w',                  // path to api.php script 
    debug: false                 // is more verbose when set to true 
});

client.getArticle('Млекопитающие', function(err, data) {
    // error handling 
    if (err) {
        console.error(err);
        return;
    }

    console.log(data);
});