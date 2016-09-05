
// Utilities

addClass = window.utils.addClass;
removeClass = window.utils.removeClass;

// MobiOne Script

var page = commonLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: "PokemonGo",
    suffix: "html5-kw-ooredoo-en-default",
    domain: "start.mobileacademy.com",
    language: "english",
    pageId: "2523",
    queryParams: window.mobiOneConstants.queryParams,
    doubleConfirmation: function(operatorId) {
        return true;
    },
    onWillTransition: function(currentState, nextState) {
        if (nextState.name == "subscription-error") {
            if (nextState.subscriptionErrorMessage == "exhausted")
                page.setState({name:"mo", containerId:"mo", shortCode: "59100", keyword: "1"})
            else
                page.setState({name:"error", containerId:"error", error: nextState.subscriptionErrorMessage})
            return false;
        }
        // prevent automatic transition from default state
        return customizations.preventAutoNumberEntry(page, currentState, nextState);
    },
    path: "mobi-one/apis/jsonp"
});

page.getReady();
