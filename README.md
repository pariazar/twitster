# Twitster
[![npm](https://img.shields.io/npm/v/twitster.svg?style=flat-square)](https://www.npmjs.com/package/twitster)
![building workflow](https://github.com/hamedpa/twitster/actions/workflows/nodejs.yml/badge.svg)
[![license](https://img.shields.io/npm/l/@vitalets/google-translate-api.svg)](https://www.npmjs.com/package/@vitalets/google-translate-api)
![alt text](./img/logo.png?raw=true)



A free and unlimited API for twitter.
## Contents

<!-- toc -->

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  * [Get-Tweets](#get-tweets)
  * [Get-Tweet-Replies](#get-tweet-replies)
  * [Search-Users](#search-users)
  * [Get-User-Detail](#get-user-detail)
  * [Translate-Tweets](#translate-tweets)
- [License](#license)

<!-- tocstop -->

## Features

* explore new tweets
* search keyword inside tweets
* search users
* get and search tweets for single user
* translate tweets

## Installation
```bash
npm install twitster
```

## Usage

### Get-Tweets

to extract list of tweets:

#### Parameters 
- `keyword` - keyword or hashtag for your tweets list
- `options` - optional parameters
    - `options.nextPageToken` - next page token for getting next page 
    - `options.page` - page number for get get specific page



##### Basic example
```javascript
var { findTopTweets } = require("twitster");

var listOfTweets = await findTopTweets("bitcoin");

console.log(listOfTweets);
```
##### Output
```javascript
[{
  authorName: 'Airmass',
  authorBlueCheckMark: false,
  retweeted: 'Deniz.Hodl⚡🐂',
  tweetContent: 'All you need to know about investing in #Bitcoin.',
  hashtags: [ '#Bitcoin' ],
  commentCount: '1',
  likeCount: '5',
  retweetCount: '0',
  quoteCount: '0',
  tweetTime: '1m',
  tweetCreatedAt: 'Dec 31, 2022 · 9:43 AM UTC',
  tweetLink: '/IT_AIRmass/status/1609123005396819969#m',
  images: [],
  nextPageToken: 'scroll%3AthGAVUV0VFVBaAgLLF_8vg1CwWhMC8-a7O4NQsEnEVhIZ6FYCJehgEVVNFUjUBFQAVAAA%3D'
},
{
    authorName: 'Math Profesor',
    authorBlueCheckMark: false,
    tweetContent: 'absolut scarcity can only be achieved with #bitcoin',
    hashtags: [ '#bitcoin' ],
    commentCount: '0',
    likeCount: '0',
    retweetCount: '0',
    quoteCount: '0',
    tweetTime: '9s',
    tweetCreatedAt: 'Dec 31, 2022 · 9:44 AM UTC',
    tweetLink: '/MathProfesor/status/1609123389364371456#m',
    images: [
      'https://nitter.tiekoetter.com/pic/media%2FFnUar77WIAAwzdu.jpg%3Fname%3Dsmall%26format%3Dwebp'
    ],
    nextPageToken: 'scroll%3AthGAVUV0VFVBaAgLLF_8vg1CwWhMC8-a7O4NQsEnEVhIZ6FYCJehgEVVNFUjUBFQAVAAA%3D'
}];
```

##### Pagination example
if you want to get next page list you can use nextToken in previous request

```javascript
var { findTopTweets } = require("twitster");

var listOfTweets = await findTopTweets("bitcoin", options = { nextPageToken: 'scroll%3AthGAVUV0VFVBaEgLPxirPi1CwWgICy8fTM4tQsEnEV8PF5FYCJehgEVVNFUjUBFRAVAAA%3D' });

console.log(listOfTweets);
```

if you want to get list by page number, need to set page in options

```javascript
var { findTopTweets } = require("twitster");

var listOfTweets = await findTopTweets("bitcoin", options = { page: 2 });

console.log(listOfTweets);
```

<hr>

### Get-Tweet-Replies

to get replies for a single tweet

#### Parameters 
- `link` - tweet link get from [Get-Tweets](#get-tweets)
- `options` - optional parameters
    - `options.nextPageToken` - next page token for getting next page

##### Basic example
```javascript
var { getTweetReplies } = require("twitster");

var listOfReplies = await getTweetReplies('IT_AIRmass/status/1609123005396819969#m');

console.log(listOfReplies);
```
##### Output
```javascript
[{
    authorName: 'Islaay',
    authorBlueCheckMark: false,
    replyingTo: 'Replying to @IT_AIRmass',
    tweetContent: 'We have waited a long time for 2023... The implosion of the CT bera hivemind',
    hashtags: null,
    commentCount: '0',
    likeCount: '0',
    retweetCount: '0',
    quoteCount: '0',
    tweetTime: '1h',
    tweetCreatedAt: 'Dec 31, 2022 · 10:30 AM UTC',
    tweetLink: '/JIslaay/status/1609134888728563713#m',
    nextPageToken: 'LBlGgMDU6Z%2FF4NQsgICwlcv74NQsgsDU5fvp5dQsgICzlfaR7tQsJQYRAAA%3D#r'
  },
  {
    authorName: 'direwolf',
    authorBlueCheckMark: false,
    replyingTo: 'Replying to @IT_AIRmass',
    tweetContent: 'Based.',
    hashtags: null,
    commentCount: '0',
    likeCount: '0',
    retweetCount: '0',
    quoteCount: '0',
    tweetTime: '15m',
    tweetCreatedAt: 'Dec 31, 2022 · 11:43 AM UTC',
    tweetLink: '/direwol54352270/status/1609153167354126336#m',
    nextPageToken: 'LBlGgMDU6Z%2FF4NQsgICwlcv74NQsgsDU5fvp5dQsgICzlfaR7tQsJQYRAAA%3D#r'
}];
```

##### Pagination example
if you want to get next page list you can use nextToken in previous request

```javascript
var { getTweetReplies } = require("twitster");

const listOfReplies = await getTweetReplies('direwol54352270/status/1609153167354126336#m',  options = { nextPageToken: 'LBlGgMDU6Z%2FF4NQsgICwlcv74NQsgsDU5fvp5dQsgICzlfaR7tQsJQYRAAA%3D#r' });

console.log(listOfReplies);
```
<hr>

### Search-Users
to search users and get list of them:

#### Parameters 
- `username` - username or full name
- `options` - optional parameters
    - `options.nextPageToken` - next page token for getting next page



##### Basic example
```javascript
var { findUsers } = require("twitster");

var listOfUsers = await findUsers("messi");

console.log(listOfUsers);
```
##### Output
```javascript
[{
    fullName: 'Lionel Messi Fan Club',
    username: '@LMessifanclub',
    bioInfo: 'A must follow for a true Messi fan! Watch videos about Leo on our YouTube channel! Be with us, be Messified!',
    link: '/LMessifanclub',
    nextPageToken: 'DAAFCgABFlTaB7l__z8LAAIAAADwRW1QQzZ3QUFBZlEvZ0dKTjB2R3AvQUFBQUJRUkRUSVZZRmZRQUFBQUFBQVBEODJsQUFBQUFEOFZpYTRBQUFBQVVzRHJ4QUFBQUFBQTl2OU9DeldVenB2WEFBQVRCWDl0QmRXZ0F4R09ac0JWMTlBQkFBQUFBR0Naa2pvVWp1VzZ4eGZBQmdBQUFBQ3Q2anBNQUFBQUFBTUVHeTBBQUFBQXFkNytlQUFBQUFDMnZSUnRBQUFBQUVJZVRlNFAzUHJzTGRSd0FBQUFBQUEyYkY4Y0RrY0ZscFFXd0FBU3NtM1YrVll3QVFBQUFBQmMvbTJXAAA'
  },
  {
    fullName: 'Leo Messi',
    username: '@leomessiprivate',
    bioInfo: 'Jugador del PSG. 🇨🇵',
    link: '/leomessiprivate',
    nextPageToken: 'DAAFCgABFlTaB7l__z8LAAIAAADwRW1QQzZ3QUFBZlEvZ0dKTjB2R3AvQUFBQUJRUkRUSVZZRmZRQUFBQUFBQVBEODJsQUFBQUFEOFZpYTRBQUFBQVVzRHJ4QUFBQUFBQTl2OU9DeldVenB2WEFBQVRCWDl0QmRXZ0F4R09ac0JWMTlBQkFBQUFBR0Naa2pvVWp1VzZ4eGZBQmdBQUFBQ3Q2anBNQUFBQUFBTUVHeTBBQUFBQXFkNytlQUFBQUFDMnZSUnRBQUFBQUVJZVRlNFAzUHJzTGRSd0FBQUFBQUEyYkY4Y0RrY0ZscFFXd0FBU3NtM1YrVll3QVFBQUFBQmMvbTJXAAA'
}];
```

##### Pagination example
if you want to get next page list you can use nextToken in previous request

```javascript
var { findUsers } = require("twitster");

var listOfUsers = await findUsers("messi", options = { nextPageToken: 'DAAFCgABFlTaB7l__z8LAAIAAADwRW1QQzZ3QUFBZlEvZ0dKTjB2R3AvQUFBQUJRUkRUSVZZRmZRQUFBQUFBQVBEODJsQUFBQUFEOFZpYTRBQUFBQVVzRHJ4QUFBQUFBQTl2OU9DeldVenB2WEFBQVRCWDl0QmRXZ0F4R09ac0JWMTlBQkFBQUFBR0Naa2pvVWp1VzZ4eGZBQmdBQUFBQ3Q2anBNQUFBQUFBTUVHeTBBQUFBQXFkNytlQUFBQUFDMnZSUnRBQUFBQUVJZVRlNFAzUHJzTGRSd0FBQUFBQUEyYkY4Y0RrY0ZscFFXd0FBU3NtM1YrVll3QVFBQUFBQmMvbTJXAAA' });

console.log(listOfUsers);
```

<hr>

### Get-User-Detail

to get detail of user

#### Parameters 
- `username` - username or full name
- `options` - optional parameters
    - `options.nextPageToken` - next page token for getting next page
    - `options.filter` - keyword to add filter tweets



##### Basic example
```javascript
var { getUserDetail } = require("twitster");

var detailOfUser = await getUserDetail("Bitcoin");

console.log(detailOfUser);
```
##### Output
```javascript
{
  profileInfo: {
    fullName: 'Bitcoin',
    username: '@Bitcoin',
    bio: "Bitcoin is an open source censorship-resistant peer-to-peer immutable network. Trackable digital gold. Don't trust; verify. Not your keys; not your coins.",
    location: 'Worldwide',
    website: 'bitcoin.org/bitcoin.pdf',
    joinDate: ' Joined August 2011',
    tweetCounts: '24,551',
    following: '26',
    follower: '5,685,033',
    likes: '2,928'
  },
  tweets: [
     {
      authorName: 'Bitcoin',
      authorBlueCheckMark: false,
      pinnedTweet: false,
      tweetContent: 'Can they prove that they did not? That is jut their attestation. 😱',
      hashtags: null,
      commentCount: '78',
      likeCount: '230',
      retweetCount: '0',
      quoteCount: '4',
      tweetTime: 'Dec 21',
      tweetCreatedAt: 'Dec 21, 2022 · 5:25 PM UTC',
      tweetLink: '/Bitcoin/status/1605615442134855680#m',
      images: [
      'https://nitter.tiekoetter.com/pic/media%2FFnUar77WIAAwzdu.jpg%3Fname%3Dsmall%26format%3Dwebp'
      ],
      nextPageToken: 'HBaAwK3pqsnovSwAAA%3D%3D'
    },
    {
      authorName: 'Bitcoin',
      authorBlueCheckMark: false,
      pinnedTweet: false,
      tweetContent: '',
      hashtags: null,
      commentCount: '290',
      likeCount: '2,344',
      retweetCount: '0',
      quoteCount: '67',
      videoCount: '176,680',
      tweetTime: 'Dec 19',
      tweetCreatedAt: 'Dec 19, 2022 · 3:29 PM UTC',
      tweetLink: '/Bitcoin/status/1604861594160070656#m',
      images: [],
      nextPageToken: 'HBaAwK3pqsnovSwAAA%3D%3D'
    }
  ]
}
```

##### Pagination example
if you want to get next page list you can use nextToken in previous request

```javascript
var { getUserDetail } = require("twitster");

var detailOfUser = await getUserDetail("Bitcoin", options = { nextPageToken: 'HBaAwK3pqsnovSwAAA%3D%3D' });

console.log(detailOfUser);
```

##### Filter example
add filter and limit result of user tweets

```javascript
var { getUserDetail } = require("twitster");

var detailOfUser = await getUserDetail("Bitcoin", options = { filter: 'doge' });

console.log(detailOfUser);
```

##### output
```javascript
{
  profileInfo: {
    fullName: 'Bitcoin',
    username: '@Bitcoin',
    bio: "Bitcoin is an open source censorship-resistant peer-to-peer immutable network. Trackable digital gold. Don't trust; verify. Not your keys; not your coins.",
    location: 'Worldwide',
    website: 'bitcoin.org/bitcoin.pdf',
    joinDate: ' Joined August 2011',
    tweetCounts: '24,551',
    following: '26',
    follower: '5,685,122',
    likes: '2,928'
  },
  tweets: [
    {
      authorName: 'Bitcoin',
      authorBlueCheckMark: false,
      pinnedTweet: false,
      tweetContent: 'Because DOGE is an altcoin. Bitcoin (BCH) is the oldest and most established cryptocurrency.',
      hashtags: null,
      commentCount: '4',
      likeCount: '6',
      retweetCount: '0',
      quoteCount: '0',
      tweetTime: '4 May 2018',
      tweetCreatedAt: 'May 4, 2018 · 5:24 PM UTC',
      tweetLink: '/Bitcoin/status/992454950524403712#m'
    },
    {
      authorName: 'Bitcoin',
      authorBlueCheckMark: false,
      pinnedTweet: false,
      tweetContent: '"Chap slapped in @Dogecoin crap app flap" - Great headline by @theregister theregister.co.uk/2015/06/29…',
      hashtags: null,
      commentCount: '0',
      likeCount: '2',
      retweetCount: '0',
      quoteCount: '0',
      tweetTime: '4 Jul 2015',
      tweetCreatedAt: 'Jul 4, 2015 · 7:22 PM UTC',
      tweetLink: '/Bitcoin/status/617413100791308289#m'
    }
]}
```
<hr>

### Translate tweets

for extract translated tweets just add language inside options</br>
find your language code from <a href="https://www.npmjs.com/package/subtranslator">here</a>

```javascript
const { findTopTweets } = require('twitster');

var translatedTweets = await findTopTweets("bitcoin", options = { language: 'de' });
console.log(translatedTweets);

```

#### Output

```javascript
[
  {
    id: '4937c6d261',
    authorName: 'marvinFrancois',
    authorBlueCheckMark: false,
    tweetContent: '#Bitcoin ist bereit für einen riesigen Bullenlauf.',
    hashtags: [ '#Bitcoin' ],
    commentCount: '0',
    likeCount: '0',
    retweetCount: '0',
    quoteCount: '0',
    tweetTime: '8s',
    tweetCreatedAt: 'Jan 5, 2023 · 8:49 PM UTC',
    tweetLink: '/marviinFrancois/status/1611102551893594115#m',
    nextPageToken: 'scroll%3AthGAVUV0VFVBaWwL6R2s7k2ywWgIDQzbnQ5NssEnEV8IV6FYCJehgEVVNFUjUBFQAVAAA%3D',
    originalTweet: '#Bitcoin    is ready for a huge bull run.'
  },
  {
    id: 'f9d902908f',
    authorName: 'Guy Swann ⚡️',
    authorBlueCheckMark: false,
    retweeted: 'thee junior class prezzy ✨',
    tweetContent: 'Es ist die grundlegende Natur und das Design von #Bitcoin, die den FTX-Betrug unweigerlich zum Scheitern verurteilt und schnell demoliert haben, als es klar wurde.\n' +
      '\n' +
      'Und aus dem gleichen Grund ist #Bitcoin unsere einzige Chance, den globalen Geldbetrug zu korrigieren.',
    hashtags: [ '#Bitcoin', '#Bitcoin' ],
    commentCount: '0',
    likeCount: '38',
    retweetCount: '0',
    quoteCount: '0',
    tweetTime: '14 Dec 2022',
    tweetCreatedAt: 'Dec 14, 2022 · 6:45 PM UTC',
    tweetLink: '/TheGuySwann/status/1603098882627567618#m',
    nextPageToken: 'scroll%3AthGAVUV0VFVBaWwL6R2s7k2ywWgIDQzbnQ5NssEnEV8IV6FYCJehgEVVNFUjUBFQAVAAA%3D',
    originalTweet: 'It is the fundamental nature & design of #Bitcoin that made the FTX fraud inevitably doomed to fail & quickly demolished when it became clear.\n' +
      '\n' +
      'And it’s the same reason why #Bitcoin is our only shot at correcting the global monetary scam.'
  }
]
```

<hr>

## Support
  - [Bug Reports](https://github.com/hamedpa/twitster/issues/)

## Contributors
<p>
Pull requests are always welcome! Please base pull requests against the main branch and follow the contributing guide.

if your pull requests makes documentation changes, please update readme file.
</p>

## License

This project is licensed under the terms of the
MIT license
