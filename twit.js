require("dotenv").config();
var Twitter = require("twitter");

var client = new Twitter({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	bearer_token: process.env.TWITTER_CONSUMER_BEARER_TOKEN,
});

const tweetMusher = (tweets) => {
	return tweets
		.map((t) => {
			return t.full_text;
		})
		.join(" ")
		.replace(/(\r\n|\n|\r)/gm, "");
};

const getTweetsSince = (username, since) => {
	console.log("Getting tweets", username, since);
	const options = { screen_name: username, count: 200, tweet_mode: "extended" };

	if (since) {
		options.since_id = since;
	}

	return new Promise((resolve, reject) => {
		client.get("statuses/user_timeline", options, function (error, tweets) {
			if (error) {
				return reject(error);
			}

			resolve(tweets);
		});
	});
};

const getTweets = async (username) => {
	let shouldReturn = false;
	let tweets = [];
	let recentId;
	while (!shouldReturn) {
		const tweetSince = await getTweetsSince(username, recentId);
		const lastId = tweetSince[tweetSince.length - 1].id;
		if (!tweetSince.length || recentId === lastId) {
			shouldReturn = true;
		}

		recentId = lastId;
		tweets = tweets.concat(tweetSince);
	}

	return tweetMusher(tweets);
};

module.exports = {
	getTweets,
};
