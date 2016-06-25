
// MobiOne

var campaignId = window.mobiOneConstants.campaignId;
var creative = "TrainYourBrain";
var suffix = "mraid-us-danal-en-default";
var state = "default-state"; // 1

var page = new mraidIframeLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: creative,
    suffix: suffix,
    domain: window.mobiOneConstants.domain,
    doubleConfirmation: false,
    language: "english",
    pageId: "2119",
    forcedPage: "1209",
    path: "apis/html/" + creative + "/" + suffix.replace(/\-/g, '/') + "/" + campaignId,
    getExtraEventArgs: function(){ // 2
        return {state: state}
    }
});


page.getReadyWithoutMount(function(){ // 3

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
    //     }
    // }

    var $iframeContainer = document.getElementById("iframe-state");
    var $trigger = document.getElementById('btn-first');
    var mounted = false; // 4
    var showIframe =function(){

        // mount only once
        if (!mounted) {
            page.mountPage();
            mounted = true;
        }

        // details for both record event and pixel firing
        details = {
            fromState: "default-state",
            toState: "show-iframe",
            trigger: {
                element: "subscribe-button",
                action: "click"
            }
        }

        // dispatch event to fire pixel
        window.utils.dispatchEvent("x-mobi-one-transition", {
            details: details
        });

        // record event to mobi-spy
        page.recordEvent("transition", details);

        // show iframe
        $iframeContainer.style.display="block";

        // change state 
        state = "double-confirmation";
    }
    $trigger.addEventListener("click",showIframe);

});
