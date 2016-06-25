
// MobiOne API

var page = new commonLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: "AmazingHDVideos",
    suffix: "html5-lk-_-en-default",
    domain: window.mobiOneConstants.domain, //"wap.mozook.com",
    language: "english",
    pageId: "2100",
    queryParams: window.mobiOneConstants.queryParams,
    doubleConfirmation: function(operatorId){
        return true;
    },
    path: "apis/jsonp"//"cmps/"
});

page.getReady();