require("dotenv").config();
var Twitter = require("twitter");

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  bearer_token: process.env.TWITTER_CONSUMER_BEARER_TOKEN,
});

const tweetMusher = (tweets) => {
  console.log("Mushing tweets", tweets.length);
  return tweets
    .map((t) => {
      return t.full_text;
    })
    .join(" ")
    .replace(/(\r\n|\n|\r)/gm, "");
};

const getTweetsMax = (username, max) => {
  console.log("Getting tweets", username, max);
  const options = {
    screen_name: username,
    count: 200,
    tweet_mode: "extended",
    trim_user: true,
  };

  if (max) {
    options.max_id = max;
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
    const tweetMax = await getTweetsMax(username, recentId);
    const lastId = tweetMax[tweetMax.length - 1].id;
    if (!tweetMax.length || recentId === lastId) {
      shouldReturn = true;
    }

    recentId = lastId;
    tweets = tweets.concat(tweetMax);
  }

  return tweetMusher(tweets);
};

module.exports = {
  getTweets,
};
