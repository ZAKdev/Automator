function mobiSpy(properties) {

    recursiveExtend(this, {
        commonEventProperties: {},
        loadStart: new Date().getTime(),
        url: "http://mone-analytics.mobileacademy.com/"
    }, properties);

};

mobiSpy.prototype.cookiesEnabled = function() {

    if (typeof(navigator.cookieEnabled) != "undefined")
        return navigator.cookieEnabled ? true : false;

    //if not IE4+ nor NS6+
    document.cookie = "test-cookie";
    return (document.cookie.indexOf("test-cookie") != -1) ? true : false;

};

// invokes the given callback with loadTime, fetchTime & navigationTime
mobiSpy.prototype.getLoadTimeObject = function(callback) {

    var self = this,
        loadTimeObject = {
            loadTime: new Date() - self.loadStart
        };

    setTimeout(function() {

        if (window.performance && window.performance.timing) {
            var timing = window.performance.timing;
            recursiveExtend(loadTimeObject, {
                DOMLoadTime: timing.loadEventEnd - timing.responseEnd,
                fetchTime: timing.responseEnd - timing.fetchStart,
                loadTime: timing.loadEventEnd - timing.navigationStart,
                navigationTime: timing.fetchStart - timing.navigationStart                
            });
        }

        callback(loadTimeObject);
        
    }, 100);

};

mobiSpy.prototype.getPageVisibilityStatus = function() {

    var hiddenProperty; 

    if (typeof document.hidden !== "undefined") {
        hiddenProperty = "hidden";
    } 

    else if (typeof document.mozHidden !== "undefined") {
        hiddenProperty = "mozHidden";
    } 

    else if (typeof document.msHidden !== "undefined") {
        hiddenProperty = "msHidden";
    } 

    else if (typeof document.webkitHidden !== "undefined") {
        hiddenProperty = "webkitHidden";
    }

    if (typeof(hiddenProperty) != "undefined")
        return {
            hiddenProperty: hiddenProperty,
            hidden: document[hiddenProperty]
        }

    return {
        hiddenProperty: null,
        hidden: null
    }

};

// extends the eventObject with time-since-last-event, time-since-page-load & 
// the commonEventProperties object (passed in at the time of construction)
mobiSpy.prototype.recordEvent = function(eventObject) {

    var self = this, 
        currentDate = new Date(),
        currentTime = currentDate.getTime(),
        timeSincePageLoad = currentTime - self.loadStart;

    if (typeof self.previousEventTime == "undefined")
        self.previousEventTime = currentTime;

    // extend event object with time-diff & time-delta
    // convert event object to JSON for transmission
    var timeSinceLastEvent = currentTime - self.previousEventTime,
        finalEventObject = recursiveExtend({
            clientSideReferrer: document.referrer,
            clientSideCreationDate: currentDate,
            clientSideCreationTime: currentTime,
            cookiesEnabled: self.cookiesEnabled(),
            pointOfGeneration: "web-page",
            timeSinceLastEvent: timeSinceLastEvent,
            timeSincePageLoad: timeSincePageLoad,
            url: window.location.href,
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            outerWidth: window.outerWidth,
            outerHeight: window.outerHeight,
            screenWidth: screen.width,
            screenHeight: screen.height
        }, self.getPageVisibilityStatus(), self.commonEventProperties, eventObject),
        eventJSON = JSON.stringify(finalEventObject);

    // make a request to the analytics server
    // passing the event object as JSON 
    try {
        xhr = new XMLHttpRequest();        
        xhr.open("POST", self.url);
        //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');        
        //xhr.send(param(finalEventObject));
        // xhr.setRequestHeader('Content-Type', 'application/json');
        // xhr.send(eventJSON);
        xhr.setRequestHeader('Content-Type', 'text/plain');
        xhr.send(eventJSON);
    } 

    catch (exception) {
        console.error(exception);
    }

    self.previousEventTime = currentTime;

};

