var $defaultState = document.getElementById("default-state")

var campaignId = window.mobiOneConstants.campaignId;
var creative = "TrainYourBrain";
var suffix = "mraid-ae-du-en-google";
var params = window.mobiOneConstants.queryParams || {};
params.state = 'try-subscribe';

var page = new mraidGoogleLandingPage({
	campaignId: window.mobiOneConstants.campaignId,
	creative: "TrainYourBrain",
	suffix: "mraid-ae-du-en-google",
	domain: "wap.mozook.com",
	doubleConfirmation: false,	
	language: "english",
	pageId: "1857",
	queryParams: params,
		onWillTransition: function(currentState, nextState){
		    if (currentState.selectedSubMethod != nextState.selectedSubMethod && nextState.selectedSubMethod == "DirectWAP") {
		        $defaultState.style.display = "block";
		    }
		    if (nextState.name == "mo") {
		        page.switchState('number-entry');
		        return false;
		    }
		    return customizations.servicePageLink(page, currentState, nextState);
		},
		render: function() {
		    var subscriberId = page.getState().subscriberId;
		    if (!!subscriberId)            
		        document.getElementById("unsubscribe").setAttribute("href", ("http://start.mobileacademy.com/cmps/subscriptioninfo.aspx?sid="+subscriberId+"&x-lang=es"));
		},
		 path: "uae/mobi-one/apis/html/" + creative + "/" + suffix.replace(/\-/g, '/') + "/" + campaignId
});

var timerD = "true";

page.getReady(function(){

var confirmBtn = document.querySelector('.confirmBtn'),
    confirmBtnBlock = document.getElementById('confirmedBtnBlock');
    confirmedBtn = document.querySelector('.confirmedBtn'),
    confirmError = document.querySelector('.confirmError');

    /* trainyourbrain */
    imgLabel = document.querySelector('.label');
    imgGirl = document.querySelector('.catdog');
    imgCats = document.querySelector('#cats');
    imgDog = document.querySelector('#dog');
    Timer = document.querySelector('.timer');
    Or = document.querySelector('#or');
    msg2 = document.querySelector('#msg2');

        
    confirmBtn.addEventListener('touchstart', confirmBtnAction);
    confirmBtnBlock.addEventListener('touchstart',confirmedBtnAction);
    confirmBtn.addEventListener('click', confirmBtnAction);
    confirmBtnBlock.addEventListener('click',confirmedBtnAction);    
    

    
        
        function confirmBtnAction(){
        
            confirmBtn.classList.add('switch');
            confirmError.style.display="none";
            confirmBtnBlock.style.display="none";
            confirmedBtn.classList.add('accept');
            confirmedBtn.classList.remove('default');

            /* trainyourbrain */
            imgLabel.classList.add('accept');
            imgGirl.classList.add('accept');
            Timer.classList.add('accept');
            imgCats.style.display="none";
            imgDog.style.display="none";
            Or.style.display="none";
            msg2.style.display="block";
            
            setTimeout(function(){
            
                confirmBtn.classList.add('accept');
            
            },475)
        
        }
        
        
        function confirmedBtnAction(){
            
            if(confirmedBtn.classList.contains('default'))
            
                confirmError.style.display="block";
            
            setTimeout(function(){
            
                confirmError.style.display="none";
            
            },3000);
                        
        }


    setTimeout(function() {
        document.body.classList.add("stop-animations");
        timerD = "false";
        stopped = true
    }, 25000);

    var mins = 1;
    var secs = mins * 60;
    var currentSeconds = 0;
    var currentMinutes = 0;

    setTimeout('Decrement()', 1000);

    Decrement = function() {

        if (timerD == "true") {

            currentMinutes = Math.floor(secs / 60);
            currentSeconds = secs % 60;
            secs--;
            if (currentSeconds <= 9) currentSeconds = ("0" + currentSeconds);
            if (currentMinutes <= 9) currentMinutes = ("0" + currentMinutes);
            document.getElementById("count").innerHTML = currentMinutes + ":" + currentSeconds;
            if (secs !== -1) setTimeout('Decrement()', 1000);


        } else {
            //do nothing...
        }
    }

});