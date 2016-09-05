
// Utilities

addClass = window.utils.addClass;
removeClass = window.utils.removeClass;

// MobiOne Script

var page = new commonMraidLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: "PokemonGo",
    suffix: "mraid-iq-_-ar-default",
    domain: "pages.mobileacademy.com",
    language: "arabic",
    pageId: "2538",
    // subMethodDetectionFailureFallbackUrl: "http://mobileacademy.com",
    // nonDirectWapFallbackUrl: "http://mobileacademy.com",
    queryParams: window.mobiOneConstants.queryParams,
    doubleConfirmation: function(operatorId) {
        return true;
    },
    onWillTransition: function(currentState, nextState) {
        return customizations.preventAutoNumberEntry(page, currentState, nextState);
    },
    path: "apis/jsonp"
});

page.getReady();
