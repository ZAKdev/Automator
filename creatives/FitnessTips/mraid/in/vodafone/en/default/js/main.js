
// MobiOne Script

var campaignId = window.mobiOneConstants.campaignId;
var creative = "FitnessTips";
var suffix = "mraid-in-vodafone-en-default";
var params = window.mobiOneConstants.queryParams || {};

var page = new commonMraidLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: creative,
    suffix: suffix,
    domain: window.mobiOneConstants.domain,
    language: "english",
    pageId: "2311",
    queryParams: params,
    doubleConfirmation: function(){ 
        return false; 
    },
    onWillTransition: function(currentState, nextState){
        return false;
    },
    path: "apis/jsonp",
});

page.getReady(function() {

    /* MobiOne Transition */

    var subscribeButton = document.getElementById("subscribe");
    var urlTarget = !window.mobiOneConstants.queryParams.redirectTo ? "" : window.mobiOneConstants.queryParams.redirectTo;
    var url = urlTarget;

    subscribeButton.addEventListener('click', function(e) {

        details = {
            fromState: "default-state",
            toState: "redirection",
            trigger: {
                element: "subscribe-button",
                action: "click",
                smsUrl: url,
                oc: "vodafone"
            }
        }
        page.recordEvent("transition", details);
        window.utils.dispatchEvent("x-mobi-one-transition", {
            details: details
        });

        if (window.mraid)
            window.mraid.open(urlTarget);
        else
            window.open(urlTarget);
        e.preventDefault();
        e.stopPropagation();
        return false;

    });

});
