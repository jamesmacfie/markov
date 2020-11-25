require("dotenv").config();
var Twitter = require("twitter");

var client = new Twitter({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	bearer_token: process.env.TWITTER_CONSUMER_BEARER_TOKEN,
});

const getTweets = (username) => {
	return new Promise((resolve, reject) => {
		client.get(
			"statuses/user_timeline",
			{ screen_name: username, count: 200, tweet_mode: "extended" },
			function (error, tweets) {
				if (error) {
					return reject(error);
				}

				const allText = tweets
					.map((t) => {
						return t.full_text;
					})
					.join(" ")
					.replace(/(\r\n|\n|\r)/gm, "");

				resolve(allText);
			}
		);
	});
};

module.exports = {
	getTweets,
};
