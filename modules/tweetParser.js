const axios = require("axios");
const jsdom = require("jsdom");
const { translate } = require('@vitalets/google-translate-api');
const { JSDOM } = jsdom;

exports.extractTweetInfo = async (data, lang) => {
  const dom = new JSDOM(data);
  const tweets = [];
  const userListSize = dom.window.document.querySelectorAll('[class="tweet-link"]').length;

  for (let i = 1; i <= userListSize; i++) {
    const authorName = dom.window.document.querySelector(`body > div > div > div.timeline > div:nth-child(${String(i)}) > div > div:nth-child(1) > div.tweet-header > div > div > a.fullname`);
    const retweeted = dom.window.document.querySelector(`body > div > div > div.timeline > div:nth-child(${String(i)}) > div > div:nth-child(1) > div.retweet-header > span > div`);
    const replyingTo = dom.window.document.querySelector(`body > div > div > div.timeline > div:nth-child(${String(i)}) > div > div.replying-to > a`);
    const tweetContent = dom.window.document.querySelector(`body > div > div > div.timeline > div:nth-child(${String(i)}) > div > div.tweet-content.media-body`);
    const commentCount = dom.window.document.querySelector(`body > div > div > div.timeline > div:nth-child(${String(i)}) > div > div.tweet-stats > span:nth-child(1) > div`);
    const likeCount = dom.window.document.querySelector(`body > div > div > div.timeline > div:nth-child(${String(i)}) > div > div.tweet-stats > span:nth-child(4) > div`);
    const retweetCount = dom.window.document.querySelector(`body > div > div > div.timeline > div:nth-child(${String(i)}) > div > div.tweet-stats > span:nth-child(2) > div > span`);
    const quoteCount = dom.window.document.querySelector(`body > div > div > div.timeline > div:nth-child(${String(i)}) > div > div.tweet-stats > span:nth-child(3) > div`);
    const videoCount = dom.window.document.querySelector(`body > div > div > div.timeline > div:nth-child(${String(i)}) > div > div.tweet-stats > span:nth-child(5) > div`);
    const tweetCreatedAt = dom.window.document.querySelector(`body > div > div > div.timeline > div:nth-child(${String(i)}) > div > div:nth-child(1) > div.tweet-header > div > span > a`);
    const blueCheckMark = dom.window.document.querySelector(`body > div > div > div.timeline > div:nth-child(${String(i)}) > div > div:nth-child(1) > div.tweet-header > div > div > a.fullname > div > span`);
    const tweetLink = dom.window.document.querySelector(`body > div > div > div.timeline > div:nth-child(${String(i)}) > a`);
    let nextPageToken = dom.window.document.querySelectorAll(`body > div > div > div.timeline > div.show-more a`);

    for (let token of nextPageToken) {
      if (token.href.includes('&cursor='));
      nextPageToken = token.href.split('&cursor=')[1];
    }

    const tweetResult = {
      authorName: authorName ? authorName.textContent : undefined,
      authorBlueCheckMark: blueCheckMark ? true : false,
      retweeted: retweeted ? retweeted.textContent.replace('retweeted', '').trim() : undefined,
      replyingTo: replyingTo ? replyingTo.textContent : undefined,
      tweetContent: tweetContent ? tweetContent.textContent : undefined,
      hashtags: tweetContent ? tweetContent.textContent.match(/#[a-z]+/gi) : undefined,
      commentCount: commentCount ? commentCount.textContent.trim() === '' ? '0' : commentCount.textContent.trim() : undefined,
      likeCount: likeCount ? likeCount.textContent.trim() === '' ? '0' : likeCount.textContent.trim() : undefined,
      retweetCount: retweetCount ? retweetCount.textContent.trim() === '' ? '0' : retweetCount.textContent.trim() : undefined,
      quoteCount: quoteCount ? quoteCount.textContent.trim() === '' ? '0' : quoteCount.textContent.trim() : undefined,
      videoCount: videoCount ? videoCount.textContent.trim() === '' ? '0' : videoCount.textContent.trim() : undefined,
      tweetTime: tweetCreatedAt ? tweetCreatedAt.textContent : undefined,
      tweetCreatedAt: tweetCreatedAt ? tweetCreatedAt.title : undefined,
      tweetLink: tweetLink ? tweetLink.href : undefined,
      nextPageToken: nextPageToken ? nextPageToken : undefined
    };
    // if (lang) {
    //   for (const key of Object.keys(tweetResult)) {
    //     if (tweetResult[key]) {
    //       tweetResult[key] = await translate(tweetResult[key], { to: 'en' });
    //     }
    //     break
    //   }
    // }
    tweets.push(tweetResult);
  }
  for (const tweet of tweets) Object.keys(tweet).forEach(key => { tweet[key] === undefined ? delete tweet[key] : {} });
  return tweets
}

//ToDo enhance pagination performance
exports.findTokenPage = async (keyword, pageNumber) => {
  //initial request
  let res = await axios({
    method: "get",
    url: `https://nitter.tiekoetter.com/search?f=tweets&q=${keyword}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  let dom = new JSDOM(res.data);
  let initToken = dom.window.document.querySelector(`body > div > div > div.timeline > div.show-more > a`);
  initToken = initToken.href.split('&cursor=')[1];

  for (let i = 1; i < pageNumber; i++) {
    res = await axios({
      method: "get",
      url: `https://nitter.tiekoetter.com/search?f=tweets&q=${keyword}&cursor=${initToken}`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    dom = new JSDOM(res.data);
    initToken = dom.window.document.querySelectorAll(`body > div > div > div.timeline > div.show-more a`);

    for (let token of initToken) {
      if (token.href.includes('&cursor='));
      initToken = token.href.split('&cursor=')[1];
    }
  }
  return initToken;
}

exports.extractUserList = async (data) => {
  const dom = new JSDOM(data);
  const users = [];
  const userListSize = dom.window.document.querySelectorAll('[class="timeline-item"]').length;
  for (let i = 1; i <= userListSize; i++) {
    const fullName = dom.window.document.querySelector(`body > div > div > div.timeline > div:nth-child(${String(i)}) > div > div.tweet-header > div > div > a`);
    const username = dom.window.document.querySelector(`body > div > div > div.timeline > div:nth-child(${String(i)}) > div > div.tweet-header > a.username`);
    const bioInfo = dom.window.document.querySelector(`body > div > div > div.timeline > div:nth-child(${String(i)}) > div > div.tweet-content.media-body`);
    const link = dom.window.document.querySelector(`body > div > div > div.timeline > div:nth-child(${String(i)}) > a`);
    let nextPageToken = dom.window.document.querySelectorAll(`body > div > div > div.timeline > div.show-more a`);

    for (let token of nextPageToken) {
      if (token.href.includes('&cursor='));
      nextPageToken = token.href.split('&cursor=')[1];
    }

    users.push({
      fullName: fullName ? fullName.textContent : undefined,
      username: username ? username.textContent : undefined,
      bioInfo: bioInfo && bioInfo !== '' ? bioInfo.textContent : undefined,
      link: link ? link.href : undefined,
      nextPageToken: nextPageToken ? nextPageToken : undefined
    });
  }
  for (const user of users) Object.keys(user).forEach(key => { user[key] === undefined ? delete user[key] : {} });
  return users;
}

exports.extractUserDetail = async (data) => {
  const dom = new JSDOM(data);
  const tweets = [];
  const fullName = dom.window.document.querySelector(`body > div > div > div.profile-tab.sticky > div.profile-card > div.profile-card-info > div > a.profile-card-fullname`);
  const username = dom.window.document.querySelector(`body > div > div > div.profile-tab.sticky > div.profile-card > div.profile-card-info > div > a.profile-card-username`);
  const profileBio = dom.window.document.querySelector(`body > div > div > div.profile-tab.sticky > div.profile-card > div.profile-card-extra > div.profile-bio`);
  const location = dom.window.document.querySelector(`body > div > div > div.profile-tab.sticky > div.profile-card > div.profile-card-extra > div.profile-location`);
  const website = dom.window.document.querySelector(`body > div > div > div.profile-tab.sticky > div.profile-card > div.profile-card-extra > div.profile-website`);
  const joinDate = dom.window.document.querySelector(`body > div > div > div.profile-tab.sticky > div.profile-card > div.profile-card-extra > div.profile-joindate`);
  const tweetCounts = dom.window.document.querySelector(`body > div > div > div.profile-tab.sticky > div.profile-card > div.profile-card-extra > div.profile-card-extra-links > ul > li.posts > span.profile-stat-num`);
  const following = dom.window.document.querySelector(`body > div > div > div.profile-tab.sticky > div.profile-card > div.profile-card-extra > div.profile-card-extra-links > ul > li.following > span.profile-stat-num`);
  const follower = dom.window.document.querySelector(`body > div > div > div.profile-tab.sticky > div.profile-card > div.profile-card-extra > div.profile-card-extra-links > ul > li.followers > span.profile-stat-num`);
  const likes = dom.window.document.querySelector(`body > div > div > div.profile-tab.sticky > div.profile-card > div.profile-card-extra > div.profile-card-extra-links > ul > li.likes > span.profile-stat-num`);

  const userListSize = dom.window.document.querySelectorAll('[class="tweet-link"]').length;

  for (let i = 1; i < userListSize; i++) {
    const authorName = dom.window.document.querySelector(`body > div > div > div.timeline-container > div > div:nth-child(${String(i)}) > div > div:nth-child(1) > div.tweet-header > div > div > a.fullname`);
    const blueCheckMark = dom.window.document.querySelector(`body > div > div > div.timeline-container > div > div:nth-child(${String(i)}) > div > div:nth-child(1) > div.tweet-header > div > a.fullname > div > span`)
    const retweeted = dom.window.document.querySelector(`body > div > div > div.timeline-container > div:nth-child(${String(i)}) > div > div:nth-child(1) > div.retweet-header > span > div`);
    const replyingTo = dom.window.document.querySelector(`body > div > div > div.timeline-container > div:nth-child(${String(i)}) > div > div.replying-to > a`);
    const tweetContent = dom.window.document.querySelector(`body > div > div > div.timeline-container > div > div:nth-child(${String(i)}) > div > div.tweet-content.media-body`);
    const commentCount = dom.window.document.querySelector(`body > div > div > div.timeline-container > div > div:nth-child(${String(i)}) > div > div.tweet-stats > span:nth-child(1) > div`);
    const likeCount = dom.window.document.querySelector(`body > div > div > div.timeline-container > div > div:nth-child(${String(i)}) > div > div.tweet-stats > span:nth-child(4) > div`);
    const retweetCount = dom.window.document.querySelector(`body > div > div > div.timeline-container > div > div:nth-child(${String(i)}) > div > div.tweet-stats > span:nth-child(2) > div > span`);
    const quoteCount = dom.window.document.querySelector(`body > div > div > div.timeline-container > div > div:nth-child(${String(i)}) > div > div.tweet-stats > span:nth-child(3) > div`);
    const videoCount = dom.window.document.querySelector(`body > div > div > div.timeline-container > div > div:nth-child(${String(i)}) > div > div.tweet-stats > span:nth-child(5) > div`);
    const tweetCreatedAt = dom.window.document.querySelector(`body > div > div > div.timeline-container > div > div:nth-child(${String(i)}) > div > div:nth-child(1) > div.tweet-header > div > span > a`);
    const tweetLink = dom.window.document.querySelector(`body > div > div > div.timeline-container > div > div:nth-child(${String(i)}) > a`);

    const pinnedTweet = dom.window.document.querySelector(`body > div > div > div.timeline-container > div > div:nth-child(${String(i)}) > div > div:nth-child(1) > div.pinned > span > div > span`)
    let nextPageToken = dom.window.document.querySelectorAll(`body > div > div > div.timeline-container > div > div.show-more a`);

    for (let token of nextPageToken) {
      if (token.href.includes('?cursor='));
      nextPageToken = token.href.split('?cursor=')[1];
    }

    tweets.push({
      authorName: authorName ? authorName.textContent : undefined,
      authorBlueCheckMark: blueCheckMark ? true : false,
      pinnedTweet: pinnedTweet ? true : false,
      retweeted: retweeted ? retweeted.textContent.replace('retweeted', '').trim() : undefined,
      replyingTo: replyingTo ? replyingTo.textContent : undefined,
      tweetContent: tweetContent ? tweetContent.textContent : undefined,
      hashtags: tweetContent ? tweetContent.textContent.match(/#[a-z]+/gi) : undefined,
      commentCount: commentCount ? commentCount.textContent.trim() === '' ? '0' : commentCount.textContent.trim() : undefined,
      likeCount: likeCount ? likeCount.textContent.trim() === '' ? '0' : likeCount.textContent.trim() : undefined,
      retweetCount: retweetCount ? retweetCount.textContent.trim() === '' ? '0' : retweetCount.textContent.trim() : undefined,
      quoteCount: quoteCount ? quoteCount.textContent.trim() === '' ? '0' : quoteCount.textContent.trim() : undefined,
      videoCount: videoCount ? videoCount.textContent.trim() === '' ? '0' : videoCount.textContent.trim() : undefined,
      tweetTime: tweetCreatedAt ? tweetCreatedAt.textContent : undefined,
      tweetCreatedAt: tweetCreatedAt ? tweetCreatedAt.title : undefined,
      tweetLink: tweetLink ? tweetLink.href : undefined,
      nextPageToken: nextPageToken ? nextPageToken : undefined
    });
  }
  for (const tweet of tweets) Object.keys(tweet).forEach(key => { tweet[key] === undefined ? delete tweet[key] : {} });
  return {
    profileInfo: {
      fullName: fullName ? fullName.textContent : undefined,
      username: username ? username.textContent : undefined,
      bio: profileBio ? profileBio.textContent : profileBio,
      location: location ? location.textContent.trim() : undefined,
      website: website ? website.textContent.trim() : undefined,
      joinDate: joinDate ? joinDate.textContent : undefined,
      tweetCounts: tweetCounts ? tweetCounts.textContent : undefined,
      following: following ? following.textContent : undefined,
      follower: follower ? follower.textContent : undefined,
      likes: likes ? likes.textContent : undefined
    },
    tweets
  }
}

exports.extractTweetDetail = async (data) => {
  const dom = new JSDOM(data);
  const replyTweets = [];
  const userListSize = dom.window.document.querySelectorAll('[class="tweet-link"]').length;

  for (let i = 1; i <= userListSize; i++) {

    const authorName = dom.window.document.querySelector(`#r > div:nth-child(${String(i)}) > div > div > div:nth-child(1) > div > div > div > a.fullname`);

    const replyingTo = dom.window.document.querySelector(`#r > div:nth-child(${String(i)}) > div > div > div.replying-to`);
    const tweetContent = dom.window.document.querySelector(`#r > div:nth-child(${String(i)}) > div > div > div.tweet-content.media-body`);

    const replyContent = dom.window.document.querySelector(`#r > div:nth-child(${String(i)}) > div > div > div.quote.quote-big > a`)
    const commentCount = dom.window.document.querySelector(`#r > div:nth-child(${String(i)}) > div > div > div.tweet-stats > span:nth-child(1) > div`);
    const likeCount = dom.window.document.querySelector(`#r > div:nth-child(${String(i)}) > div > div > div.tweet-stats > span:nth-child(4) > div`);
    const retweetCount = dom.window.document.querySelector(`#r > div:nth-child(${String(i)}) > div > div > div.tweet-stats > span:nth-child(2) > div`);
    const quoteCount = dom.window.document.querySelector(`#r > div:nth-child(${String(i)}) > div > div > div.tweet-stats > span:nth-child(3) > div`);
    const videoCount = dom.window.document.querySelector(`#r > div:nth-child(${String(i)}) > div > div > div.tweet-stats > span:nth-child(5) > div`);
    const tweetCreatedAt = dom.window.document.querySelector(`#r > div:nth-child(${String(i)}) > div > div > div:nth-child(1) > div > div > span > a`);
    const blueCheckMark = dom.window.document.querySelector(`#r > div:nth-child(${String(i)}) > div > div > div:nth-child(1) > div > div > div > a.fullname > div > span`);
    const tweetLink = dom.window.document.querySelector(`#r > div:nth-child(${String(i)}) > div > a`);
    let nextPageToken = dom.window.document.querySelectorAll(`#r > div.show-more a`);

    for (let token of nextPageToken) {
      if (token.href.includes('?cursor='));
      nextPageToken = token.href.split('?cursor=')[1];
    }

    const tweetResult = {
      authorName: authorName ? authorName.textContent : undefined,
      authorBlueCheckMark: blueCheckMark ? true : false,
      replyingTo: replyingTo ? replyingTo.textContent : undefined,
      tweetContent: tweetContent ? tweetContent.textContent : undefined,
      hashtags: tweetContent ? tweetContent.textContent.match(/#[a-z]+/gi) : undefined,
      commentCount: commentCount ? commentCount.textContent.trim() === '' ? '0' : commentCount.textContent.trim() : undefined,
      likeCount: likeCount ? likeCount.textContent.trim() === '' ? '0' : likeCount.textContent.trim() : undefined,
      retweetCount: retweetCount ? retweetCount.textContent.trim() === '' ? '0' : retweetCount.textContent.trim() : undefined,
      quoteCount: quoteCount ? quoteCount.textContent.trim() === '' ? '0' : quoteCount.textContent.trim() : undefined,
      videoCount: videoCount ? videoCount.textContent.trim() === '' ? '0' : videoCount.textContent.trim() : undefined,
      tweetTime: tweetCreatedAt ? tweetCreatedAt.textContent : undefined,
      tweetCreatedAt: tweetCreatedAt ? tweetCreatedAt.title : undefined,
      tweetLink: tweetLink ? tweetLink.href : undefined,
      nextPageToken: nextPageToken ? nextPageToken : undefined
    };
    replyTweets.push(tweetResult);
  }
  for (const tweet of replyTweets) Object.keys(tweet).forEach(key => { tweet[key] === undefined ? delete tweet[key] : {} });

  return replyTweets;
}