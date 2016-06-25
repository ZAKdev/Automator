var page = new mraidGoogleLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: "TrainYourBrain",
    suffix: "mraid-qa-qtel-en-google",
    domain: "wap.mozook.com",
    doubleConfirmation: true,
    language: "english",
    pageId: "2112",
    queryParams: window.mobiOneConstants.queryParams,
    onWillTransition: function(currentState, nextState) {
        // prevent automatic transition from default state
        return customizations.preventAutoNumberEntry(page, currentState, nextState);
    },
    path: "cmps/"
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
