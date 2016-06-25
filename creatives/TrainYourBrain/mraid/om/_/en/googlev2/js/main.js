var campaignId = window.mobiOneConstants.campaignId;
var creative = "TrainYourBrain";
var suffix = "mraid-om-_-en-google2";
var params = window.mobiOneConstants.queryParams || {};
params.state = 'try-subscribe';

var page = new mraidGoogleLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: "TrainYourBrain",
    suffix: "mraid-om-_-en-google2",
    domain: "start.mobileacademy.com",
    language: "english",
    pageId: "2327",
    queryParams: params,
    path: "",
    doubleConfirmation: function(operatorId){      
        return true;
    },
    onWillTransition: function(currentState, nextState){
        return true;
    }
});

page.getReady(function() {

    setTimeout(function() {
        document.body.classList.add("stop-animations");
    }, 25000);

    var mins = 1;
    var secs = mins * 60;
    var currentSeconds = 0;
    var currentMinutes = 0;
    setTimeout('Decrement()', 1000);
    Decrement = function () {
        currentMinutes = Math.floor(secs / 60);
        currentSeconds = secs % 60;
        secs--;
        if (currentSeconds <= 9) currentSeconds = ("0" + currentSeconds);
        if (currentMinutes <= 9) currentMinutes = ("0" + currentMinutes);
        document.getElementById("count").innerHTML = currentMinutes + ":" + currentSeconds;
        if (secs !== -1) setTimeout('Decrement()', 1000);
    }

});
