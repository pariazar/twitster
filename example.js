const { findTopTweets } = require('.');
(async () => {
    var listOfTweets = await findTopTweets("bitcoin", options = { language: 'de' });
    console.log(listOfTweets);
})()