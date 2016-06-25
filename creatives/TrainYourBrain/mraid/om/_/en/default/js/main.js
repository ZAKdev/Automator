
/* Custom */

var subscribeBtn = document.getElementById('subscribe'),
    linkBtn = document.getElementById('subscribe-link')
    imgLabel = document.querySelector('.label'),
    imgGirl = document.querySelector('.catdog'),
    imgDog = document.querySelector('#dog'),
    imgCats = document.querySelector('#cats'),
    Or = document.querySelector('#or'),
    Timer = document.querySelector('.timer'),
    msg2 = document.querySelector('#msg2'),
    cancel = document.getElementById('double-confirmation-no');

function subscribeBtnAction(){
    imgLabel.classList.add('accept');
    imgGirl.classList.add('accept');
    imgDog.style.display="none";
    imgCats.style.display="none";
    Or.style.display="none";
    Timer.classList.add('accept');
    msg2.style.display="block";
}

function cancelBtnAction(){
    imgLabel.classList.remove('accept');
    imgGirl.classList.remove('accept');
    imgDog.style.display="block";
    imgCats.style.display="block";
    Or.style.display="block";
    Timer.classList.remove('accept');
    msg2.style.display="none";
}

changeClickListener = (function() {
    var changed = false;
    return function() {
        if (!changed) {
            changed = true;
            var subscribeButtons = document.getElementsByClassName("subscribe");
            for (var i = 0; i < subscribeButtons.length; i++) {
                subscribeButtons[i].addEventListener("click", function(e) {
                    if (window.mraid)
                        window.mraid.open("http://mobileacademy.com");
                    else
                        window.open("http://mobileacademy.com");  
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }, true);
            }
        }
    }
})();

var page = new commonMraidLandingPage({
	campaignId: window.mobiOneConstants.campaignId,
	creative: "TrainYourBrain",
	suffix: "mraid-om-_-en-default",
	domain: "start.mobileacademy.com",
    doubleConfirmation: true,
	language: "english",
	pageId: "2184", 
    queryParams: window.mobiOneConstants.queryParams,
    subMethodDetectionFailureFallbackUrl: "http://mobileacademy.com",
    nonDirectWapFallbackUrl: "http://mobileacademy.com",
    doubleConfirmation: function(operatorId){      
      return true;
    },
    onWillTransition: function(currentState, nextState){
        return customizations.preventAutoNumberEntry(page, currentState, nextState);
    },
    path: "",
    render: function(state) {
         // if sub method is not directwap, add changeClickListener on subscribe button
           if (state.selectedSubMethod && state.selectedSubMethod != "DirectWAP")
               changeClickListener();
    }

});


page.getReady(function(){

    var mins = 1;
    var secs = mins * 60;
    var currentSeconds = 0;
    var currentMinutes = 0;
    var timer = setTimeout('Decrement()', 1000);
    var timeStart = 1;
    var timeEnd = 00;
    Decrement = function () {
        if (timeStart != timeEnd) {
            currentMinutes = Math.floor(secs / 60);
            currentSeconds = secs % 60;
            secs--;
            if (currentSeconds <= 9) currentSeconds = ("0" + currentSeconds);
            if (currentMinutes <= 9) currentMinutes = ("0" + currentMinutes);
            document.getElementById("count").innerHTML = currentMinutes + ":" + currentSeconds;
            if (secs !== -1) setTimeout('Decrement()', 1000);
            timeStart++;
        } else {
            clearTimeout(timer);
        }
    }

    subscribeBtn.addEventListener('click',subscribeBtnAction);
    linkBtn.addEventListener('click',subscribeBtnAction);
    cancel.addEventListener('click',cancelBtnAction);    

});




