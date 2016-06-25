
// MobiOne Script

var page = new commonMraidLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: "FitnessTips",
    suffix: "mraid-au-_-en-default",
    domain: window.mobiOneConstants.domain, 
    doubleConfirmation: false,
    language: "english",
    pageId: "2101",
    queryParams: window.mobiOneConstants.queryParams,
    onWillTransition: function(currentState, nextState){
        if (currentState.name == "congrats" && nextState.name == "service-page" && !nextState.forced){
            setTimeout(function(){
                nextState.forced = true
                page.setState(nextState, {action: "customization"}, {redirectUrl: nextState.nextUrl})
            }, 15000)
            return false;
        }
        return true;
    },
    subMethodDetectionFailureFallbackUrl: "http://aotm.me",
    nonDirectWapFallbackUrl: "http://aotm.me",
    onSubscribeClick: function(){
        state = page.getState();
        page.recordEvent("subscribe-click", {
            "currentStateName": state.name,
            "selectedSubMethod": state.selectedSubMethod
        });
        return true;
    },
    path: "apis/jsonp"
});

page.getReady();
