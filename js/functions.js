$(document).on('ready', function(){
    //getLocation();
    getTweets();
});
// END Doc Ready

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        alert("Geolocation is not supported by this browser.");
    }
}
var latitude, longitude, geoCode;

function showPosition(position) {
    console.log(position);
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    //getTweets();
}

function getTweets() {
    var cb = new Codebird;
    cb.setConsumerKey("k2Pj4kyLrLMI9bozMxGyejM7M", "u0SQcO2L7wQmXaPJ7I7a6jusokIVDeQPfWCbX1pRiXnG628Xbd");
    // cb.setToken("127322873-DDEI4KMW0mEiEC9FapYj74I5OfgWSZJ8OmTwLjEL", "QJNwyQBgPpAroNUZtepDu6eCA7Y7lfz8LmueW9CX5Losa");
    cb.__call(
        "oauth2_token",
        {},
        function (reply) {
            var bearer_token = reply.access_token;
        }
    );
    var token = "AAAAAAAAAAAAAAAAAAAAADJQbAAAAAAAqMcYtU7yxTKUag2ab0oBaXAPbPM%3D0yRYYB7dhbIlpCKraGo2FrYrFq5u3wTK1n1nkS8pmeBsk82hJV";
    cb.setBearerToken(token);

    geoCode = [latitude, longitude, '1mi'];
    var params = {
        q: "NowPlaying",
        count: '5',
        result_type: 'recent'
        //geocode: geoCode.join()
    };
    cb.__call(
        "search_tweets",
        params,
        function (reply) {
            console.log(reply);

            var eachTweet = reply.statuses;
            var elemeObj = [];
            for(var i = 0; i < eachTweet.length; i++){
                var tweetInfo = {
                    pic: eachTweet[i].user.profile_image_url,
                    name: eachTweet[i].user.name,
                    user: '@' + eachTweet[i].user.screen_name,
                    text: eachTweet[i].text,
                    follow: 'https://twitter.com/intent/retweet?tweet_id=' + eachTweet[i].id
                }
                elemeObj.push(tweetInfo);
            }
            $('.tweetContainer').loadTemplate('#tweetsTemplate', elemeObj);

            $('.tweetWidget .button a').attr('target', '_blank');
        }
    );
}









