
// MobiOne Script

var page = new commonMraidLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: "TrainYourBrain",
    suffix: "mraid-fi-sonera-fi-default",
    domain: "suomi1.txtnation.com",
    doubleConfirmation: true,
    language: "finnish",
    pageId: "2274",
    queryParams: window.mobiOneConstants.queryParams,
    subMethodDetectionFailureFallbackUrl: "http://mobileacademy.com",
    nonDirectWapFallbackUrl: "http://mobileacademy.com",
    onWillTransition: function(currentState, nextState){
        return customizations.preventAutoNumberEntry(page, currentState, nextState, function(e) {
            return {selectedLanguage: prelude.find(function(element){ return element.tagName == "INPUT" && element.checked })(document.getElementsByName("language")).value};
        });
    },
    path: "apis/jsonp"
});

page.getReady();
