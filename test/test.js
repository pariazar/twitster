const expect = require('chai').expect;
const { findTopTweets, findUsers, getUserDetail, getTweetReplies } = require('..');

describe('Testing Response of service" ', async () => {
	it('check service availability', async () => {
		var listOfTweets = await findTopTweets("bitcoin");
		expect(listOfTweets.length).to.greaterThan(0);
	}).timeout(4000);

});