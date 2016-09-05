// Mraid

var page = new commonMraidLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: "PokemonGo",
    suffix: "mraid-qa-qtel-en-default",
    domain: "pages.mobileacademy.com",
    doubleConfirmation: true,
    language: "english",
    pageId: "2544",
    queryParams: window.mobiOneConstants.queryParams,
    subMethodDetectionFailureFallbackUrl: "http://mobileacademy.com",
    nonDirectWapFallbackUrl: "http://mobileacademy.com",
    onWillTransition: function(currentState, nextState){
        // prevent auto redirect to number-entry
        return customizations.preventAutoNumberEntry(page, currentState, nextState) && customizations.preventAutoOperatorSelection(page, currentState, nextState);
    },
    path: "apis/jsonp"
});

page.getReady();
