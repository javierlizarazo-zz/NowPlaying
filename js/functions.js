$(document).on('ready', function(){
    getLocation();
    //validateApi();

    $('.tweetBtn').on('click', function(){
        tweetNew();
    });
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
    validateApi();
}

// setInterval(function(){
//     getTweets();
// }, 10000);

var cb = new Codebird;

function validateApi(){
    cb.setConsumerKey("gEFEbGdkVTDfzVgyiiCbzUImi", "Q4yQ000AiJL110zoNEkBYL0ASl84SUcnaxkCJ01uZzeghqWeXX");
    cb.__call(
        "oauth2_token",
        {},
        function (reply) {
            var bearer_token = reply.access_token;
        }
    );
    var token = "2BvWRRiTPyQUiMU2Zl59yOdfk%3DECQQdP5dVANyvH62RNhHioT4culhhqLhCTE5TsAMhqbd39HI1Z";
    cb.setBearerToken(token);
    getTweets();
}

function getTweets() {
    $('.loader').show();
    
    geoCode = [latitude, longitude, '1mi'];
    var params = {
        q: "NowPlaying",
        count: '2000',
        result_type: 'recent'
        //,geocode: geoCode.join()
    };

    var nplayer = 0;

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
                    retweet: 'https://twitter.com/intent/retweet?tweet_id=' + eachTweet[i].id_str,
                    reply: 'https://twitter.com/intent/tweet?in_reply_to=' + eachTweet[i].id_str,
                    favorite: 'https://twitter.com/intent/favorite?tweet_id=' + eachTweet[i].id_str,
                    follow: 'https://twitter.com/intent/user?screen_name=' + eachTweet[i].user.screen_name
                }


                $.each(eachTweet[i].entities.urls, function(index, element){
                    if(element.expanded_url.indexOf('youtu') != -1 && nplayer < 5){
                        console.log(element.expanded_url);
                        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
                        var match = element.expanded_url.match(regExp);
                        if (match && match[7].length == 11){
                            tweetInfo.video = match[7];
                            tweetInfo.playerId = 'playerId' + nplayer;
                            elemeObj.push(tweetInfo);
                        }
                        nplayer++;
                    }
                });
            }
            $('.tweetContainer').loadTemplate('#tweetsTemplate', elemeObj);
            $('.loader').hide();
            onAPIReady();
        }
    );
}

function tweetNew() {
    var url = window.location.href;
    var text = $('#Comment').val();
    var link = $('#videoUrl').val();
    var hash = "NowPlaying";

    window.open('https://twitter.com/intent/tweet?url='+ url +'&text='+ text + link +'&hashtags='+ hash +'', 'twitter', 'toolbar=no,width=514, height=414');
    return false;
}


/****************************************** YOUTUBE PLAYER */

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var playerPos = new Array();

function onAPIReady() {
    if($('.video').length > 0){
        $.each($('.video'), function(i, e){
            var videoID = $(e).attr('alt');
            var id = $(e).attr('id');

            player = new YT.Player(id, {
                videoId: videoID,
                playerVars: {
                    html5: 1,
                    loop: 1,
                    wmode: "opaque"
                }
            });

            playerPos[i] = player;          
        });
    }

}








