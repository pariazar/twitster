const expect = require('chai').expect;
const { findTopTweets, findUsers, getUserDetail, getTweetReplies } = require('..');

describe('Testing Response of service" ', async () => {
	it('finding top tweets', async () => {
		var listOfTweets = await findTopTweets("bitcoin");
		expect(listOfTweets.length).to.greaterThan(0);
		listOfTweets.map((tweet) => {
			expect(tweet.authorName).to.exist;
			expect(tweet.nextPageToken).to.exist;
			expect(tweet.tweetLink).to.exist;
			expect(tweet.tweetCreatedAt).to.exist;
			if (tweet.tweetContent.includes('#')) {
				expect(tweet.hashtags.length).to.greaterThan(0);;
			}
		});
	}).timeout(10000);

	it('finding top tweets by page number', async () => {
		var listOfTweets = await findTopTweets("bitcoin", options = { page: 2 });
		expect(listOfTweets.length).to.greaterThan(0);
	}).timeout(10000);

	it('finding top users', async () => {
		var listOfUsers = await findUsers("messi");
		expect(listOfUsers.length).to.greaterThan(0);
		listOfUsers.map((user) => {
			expect(user.fullName).to.exist;
			expect(user.username).to.exist;
			expect(user.link).to.exist;
			expect(user.nextPageToken).to.exist;
		});
	}).timeout(10000);

	it('getting detail user', async () => {
		var detailOfUser = await getUserDetail("Bitcoin");
		expect(detailOfUser.profileInfo.fullName).to.exist;
		expect(detailOfUser.profileInfo.location).to.exist;
	}).timeout(10000);
});