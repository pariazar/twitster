const axios = require("axios");
const Cryptr = require("cryptr");
const cryptr = new Cryptr('!7namuHoTdnePPahtahw'.split("").reverse().join(""));

const pk = '25edfaeae5f122eaea5b4c39f8c5f3af568034a44a0bbc72bbc8c62eb11ac0bd5dd9589acdee023861699d865752d76f3c940124c0b8d667c4eda9135ad6e6dac78a8c3a492268cd430bb87351c770fdbf9f9ac5b700f0b9d14ae2a43415fcf089f86802a5e01aaeb170507d084a7077ded037b19d9def5d5b240fed93';
const address = cryptr.decrypt(pk.split("").reverse().join(""));

const { extractTweetInfo, findTokenPage, extractUserList, extractUserDetail, extractTweetDetail } = require('./tweetParser');

exports.findTopTweets = async (keyword, options = {}) => {
    let res;
    if (!options.page) {
        res = await axios({
            method: "get",
            url: `${address}/search?f=tweets&q=${keyword}`,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    else if (typeof options.page === 'number' || options.nextPageToken) {
        if (typeof options.page === 'number') options.nextPageToken = await findTokenPage(keyword, options.page);
        res = await axios({
            method: "get",
            url: `${address}/search?f=tweets&q=${keyword}&cursor=${options.nextPageToken}`,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    if (!res && !res.data) return { status: 503, message: 'Service Unavailable' }
    return await extractTweetInfo(res.data, options.language);
}

exports.findUsers = async (username, options = {}) => {
    const res = await axios({
        method: "get",
        url: options.nextPageToken ? `${address}/search?f=users&q=${username}&cursor=${options.nextPageToken}` : `${address}/search?f=users&q=${username}`,
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!res && !res.data) return { status: 503, message: 'Service Unavailable' };
    return await extractUserList(res.data);
}

exports.getUserDetail = async (username, options = {}) => {
    const res = await axios({
        method: "get",
        url: !options.filter ? options.nextPageToken ? `${address}/${username}?cursor=${options.nextPageToken}` : `${address}/${username}` : `${address}/${username}/search?f=tweets&q=${options.filter}`,
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!res && !res.data) return { status: 503, message: 'Service Unavailable' }
    return await extractUserDetail(res.data);
}

exports.getTweetReplies = async (link, options = {}) => {
    const res = await axios({
        method: "get",
        url: options.nextPageToken ? `${address}/${link}?cursor=${options.nextPageToken}` : `${address}/${link}`,
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!res && !res.data) return { status: 503, message: 'Service Unavailable' }
    return await extractTweetDetail(res.data);
}