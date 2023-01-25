const { findTopTweets,getUserDetail  } = require('.');
(async () => {
    // var listOfTweets = await findTopTweets("bitcoin", options = { language: 'de' });
    var listOfTweets = await findTopTweets("bitcoin");
    var detailOfTweets = await getUserDetail ("wild_ragnar");
    console.log(listOfTweets);
    console.log(detailOfUserTweets);
})()