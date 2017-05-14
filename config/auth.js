// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'       : process.env.FACEBOOK_APP_ID,
        'clientSecret'   : process.env.FACEBOOK_APP_SECRET,
        'callbackURL'    : process.env.FACEBOOK_CALLBACK_URL
    },

    'twitterAuth' : {
        'consumerKey'    : process.env.TWITTER_CONSUMER_KEY,
        'consumerSecret' : process.env.TWITTER_CONSUMER_SECRET,
        'callbackURL'    : process.env.TWITTER_CALLBACK_URL
    },

    'githubAuth' : {
        'clientID'       : process.env.TWITTER_CONSUMER_KEY,
        'clientSecret'   : process.env.TWITTER_CONSUMER_SECRET,
        'callbackURL'    : process.env.TWITTER_CALLBACK_URL
    },

    'googleAuth' : {
        'clientID'       : process.env.GOOGLE_APP_ID,
        'clientSecret'   : process.env.GOOGLE_APP_SECRET,
        'callbackURL'    : process.env.GOOGLE_CALLBACK_URL
    }

};

