var page = new commonLandingPage({
	campaignId: window.mobiOneConstants.campaignId,
	creative: "FitnessTips",
	suffix: "html5-gb-_-en-default",
	domain: "start.mobileacademy.com",
	language: "english",
	pageId: "1878",
	queryParams: window.mobiOneConstants.queryParams,
    doubleConfirmation: function(operatorId){      
    	return true;
    },
    onWillTransition: function(currentState, nextState){
    	return true;
    },
	path: "cmps/"
});

page.getReady()
