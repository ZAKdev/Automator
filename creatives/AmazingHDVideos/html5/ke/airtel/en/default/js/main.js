
// MobiOne API

var page = new commonLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: "AmazingHDVideos",
    suffix: "html5-ke-airtel-en-default",
    domain: window.mobiOneConstants.domain,
    language: "english",
    pageId: "2195",
    queryParams: window.mobiOneConstants.queryParams,
    doubleConfirmation: function(operatorId){
        return true;
    },
    path: "apis/jsonp"
});

page.getReady();
