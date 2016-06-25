var commonEventProperties = {
	userId: window.mobiOneConstants.userId,
    sessionId: window.mobiOneConstants.sessionId,
    clientSessionId: window.mobiOneConstants.clientSessionId,
};

if (typeof(window.mobiOneConstants.ab) != "undefined")
	commonEventProperties.ab = window.mobiOneConstants.ab

var spy = new mobiSpy({
    commonEventProperties: commonEventProperties,
    url: window.mobiOneConstants.spyServer
});