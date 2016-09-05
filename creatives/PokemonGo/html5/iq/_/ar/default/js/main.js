
// Utilities

addClass = window.utils.addClass;
removeClass = window.utils.removeClass;

// MobiOne Script

var page = commonLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: "PokemonGo",
    suffix: "html5-iq-_-ar-default",
    domain: "pages.mobileacademy.com",
    language: "arabic",
    pageId: "2526",
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
