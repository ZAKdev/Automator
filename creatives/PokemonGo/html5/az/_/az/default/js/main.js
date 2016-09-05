// Utilities

addClass = window.utils.addClass
removeClass = window.utils.removeClass

// HTML5

var page = new commonLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: "PokemonGo",
    suffix: "html5-az-_-az-default",
    domain: "start.mobileacademy.com",
    doubleConfirmation: false,
    pageId: "2532",
    queryParams: window.mobiOneConstants.queryParams,
    onWillTransition: function(currentState, nextState) {
        // prevent automatic transition from default state
        return customizations.preventAutoNumberEntry(page, currentState, nextState);
    },
    path: "azerbaijan"
});

page.getReady();


