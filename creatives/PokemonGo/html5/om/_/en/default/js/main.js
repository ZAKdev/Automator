// Utilities

addClass = window.utils.addClass;
removeClass = window.utils.removeClass;

// Mraid

var page = commonLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: "PokemonGo",
    suffix: "html5-om-_-en-default",
    domain: "start.mobileacademy.com",
    language: "english",
    pageId: "2522",
    queryParams: window.mobiOneConstants.queryParams,
    doubleConfirmation: function(operatorId) {
        return true;
    },
    onWillTransition: function(currentState, nextState) {
        return customizations.preventAutoNumberEntry(page, currentState, nextState);
    },
    path: ""
});

page.getReady();
