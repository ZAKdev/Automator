// Utilities

addClass = window.utils.addClass;
removeClass = window.utils.removeClass;

// HTML5

var page = new commonLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: "PokemonGo",
    suffix: "html5-ae-du-en-default",
    domain: window.mobiOneConstants.domain,
    language: "english",
    pageId: "2520",
    queryParams: window.mobiOneConstants.queryParams,
    doubleConfirmation: function(operatorId) {
        return false;
    },
    forcedPage: "",
    path: "apis/jsonp",
    mapIframeConfirmationUrl: function(url) {
        return url + "&color1=ffffff&color2=d00213&color3=ff5900"
    }
});

page.mountPage();
page.getReadyWithoutMount();