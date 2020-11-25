require("dotenv").config();
var Twitter = require("twitter");

var client = new Twitter({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	bearer_token: process.env.TWITTER_CONSUMER_BEARER_TOKEN,
});

const getTweetsSince = (username, since) => {
	const options = { screen_name: username, count: 200, tweet_mode: "extended" };

	return new Promise((resolve, reject) => {
		let shouldReturn = false;
		while (!shouldReturn) {
			client.get("statuses/user_timeline", options, function (error, tweets) {
				if (error) {
					return reject(error);
				}

				const allText = tweets
					.map((t) => {
						return t.full_text;
					})
					.join(" ")
					.replace(/(\r\n|\n|\r)/gm, "");

				console.log("LATEST", tweets[tweets.length - 1]);

				resolve(allText);
			});
		}
	});
};

const getTweets = async (username) => {
	let shouldReturn = false;
	let tweets;
	while (!shouldReturn) {
		tweets = await getTweetsSince(username);
		shouldReturn = true;
	}

	return tweets;
};

module.exports = {
	getTweets,
};
