var page = new commonLandingPage({
	campaignId: window.mobiOneConstants.campaignId,
	creative: "FitnessTips",
	suffix: "html5-kw-ooredoo-en-default",
	domain: "start.mobileacademy.com", //window.mobiOneConstants.domain,
	doubleConfirmation: true,	
	language: "english",
	pageId: "1733",
	queryParams: window.mobiOneConstants.queryParams,
    doubleConfirmation: function(operatorId){      
    	return true;
    },
    onWillTransition: function(currentState, nextState){
    	return true;
    },
	path: "mobi-one/apis/jsonp",
});

page.getReady();


