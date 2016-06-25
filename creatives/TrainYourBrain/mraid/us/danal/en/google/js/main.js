// MobiOne

var campaignId = window.mobiOneConstants.campaignId;
var creative = "TrainYourBrain";
var suffix = "mraid-us-danal-en-google";

var page = new mraidGoogleLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: creative,
    suffix: suffix,
    domain: window.mobiOneConstants.domain,
    doubleConfirmation: false,
    language: "english",
    pageId: "2121",
    forcedPage: "1209",
    path: "apis/html/" + creative + "/" + suffix.replace(/\-/g, '/') + "/" + campaignId
});


page.getReady(function() {

    // var timerD = "true",
    //     mins = 1,
    //     secs = mins * 60,
    //     currentSeconds = 0,
    //     currentMinutes = 0;

    // setTimeout('Decrement()', 1000);

    // Decrement = function() {

    //     if (timerD == "true") {

    //         currentMinutes = Math.floor(secs / 60);
    //         currentSeconds = secs % 60;
    //         secs--;
    //         if (currentSeconds <= 9) currentSeconds = ("0" + currentSeconds);
    //         if (currentMinutes <= 9) currentMinutes = ("0" + currentMinutes);
    //         document.getElementById("count").innerHTML = currentMinutes + ":" + currentSeconds;
    //         if (secs !== -1) setTimeout('Decrement()', 1000);


    //     } else {
    //         //do nothing...
    //     }
    // }

    document.getElementById("btn-first").addEventListener("click", function() {
        document.getElementById("default-state").style.display = "none";
        document.getElementById("iframe-state").style.display = "block"
    });

    document.getElementById("subscribe-link").addEventListener("click", function() {
        document.getElementById("default-state").style.display = "none";
        document.getElementById("iframe-state").style.display = "block"
    });

});
