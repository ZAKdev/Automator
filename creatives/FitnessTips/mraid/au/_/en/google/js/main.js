var campaignId = window.mobiOneConstants.campaignId;
var creative = "FitnessTips";
var suffix = "mraid-au-_-en-google";
var params = window.mobiOneConstants.queryParams || {};
params.state = 'try-subscribe';

var page = new mraidGoogleLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: "FitnessTips",
    suffix: "mraid-au-_-en-google",
    domain: window.mobiOneConstants.domain,
    doubleConfirmation: true,
    language: "english",
    pageId: "2147",
    queryParams: window.mobiOneConstants.queryParams,
    onWillTransition: function(currentState, nextState) {
        if (currentState.name == "congrats" && nextState.name == "service-page" && !nextState.forced) {
            setTimeout(function() {
                nextState.forced = true
                page.setState(nextState, {
                    action: "customization"
                }, {
                    redirectUrl: nextState.nextUrl
                })
            }, 15000)
            return false;
        }
        return true;
    },
    path: "apis/html/" + creative + "/" + suffix.replace(/\-/g, '/') + "/" + campaignId
});

page.getReady(function() {

    /*
    Timer script, after 25secs it will sto. This script is for Google RTB only, if you will use this
    for HTML5, just remove the "timerD = false" on timeout function - Genesis
    */

    var mins = 0.4; //timer starts at 00:25
    var secs = mins * 60;
    var currentSeconds = 0;
    var currentMinutes = 0;
    var timerD = true;
    var container = document.getElementById('container');

    Decrement = function() {
        if (timerD == true) {
            currentMinutes = Math.floor(secs / 60);
            currentSeconds = secs % 60;
            secs--;
            if (currentSeconds <= 9) currentSeconds = ("0" + currentSeconds);
            if (currentMinutes <= 9) currentMinutes = ("0" + currentMinutes);
            document.getElementById("count").innerHTML = currentMinutes + ":" + currentSeconds;
            if (secs !== -1) setTimeout('Decrement()', 1000);
        }
    }

    setTimeout(Decrement(), 1000);

    setTimeout(function() {
        document.body.classList.add("stop-animations");
        timerD = false;
        container.classList.add('no-anim');
    }, 25000);

});


