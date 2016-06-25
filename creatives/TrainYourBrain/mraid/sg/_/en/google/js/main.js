
creative = "TrainYourBrain"
suffix = "mraid-sg-_-en-google"
campaignId = window.mobiOneConstants.campaignId

var params = window.mobiOneConstants.queryParams || {};
params.state = 'try-subscribe';

if (params.carrierId != '70692')
    params.OC = '262';

// carrierId [70690(SingTel), 70691(M1), 70692(StarHub)]
// https://developers.google.com/adwords/api/docs/appendix/mobilecarriers
var sgDomain, sgPath;
switch (params.carrierId) {
    case '70690':
        sgDomain = 'start.mobileacademy.com';
        sgPath = 'cmps/'
        break;
    case '70692':
        sgDomain = window.mobiOneConstants.domain;
        sgPath = "apis/html/" + creative + "/" + suffix.replace(/\-/g, '/') + "/" + campaignId;
        break;
    default:
        sgDomain = 'bing.com';
        sgPath = ''
        break;
}

document.getElementById("container").classList.add(params.carrierId == '70692' ? 'starhub' : 'singtel');

var page = mraidGoogleLandingPage({
    campaignId: campaignId,
    creative: creative,
    suffix: suffix,
    domain: sgDomain,
    doubleConfirmation: true,
    language: "english",
    pageId: "2124",
    queryParams: params,
    path: sgPath,
    render: function() {
        if (params.carrierId == '70692') {
            state = page.getState();
            $agreeButton = document.getElementById("agree-button");
            $agreeButton.className = state.agreed ? "checked" : "";
            $agreeButton.style.display = state.showStates ? "none" : "block";
            $states = document.getElementById("states");
            $states.style.display = state.showStates ? "block" : "none";
        }
    },
    onWillTransition: function(currentState, nextState){
        if (params.carrierId == '70692') {
            if (currentState.name == "double-confirmation" && 
                nextState.name == "default-state" && 
                nextState.agreed)
                page.setState({agreed: false, showStates: false});
            if (nextState.name == "mo") {
                page.switchState("number-entry");
                return false;
            } else
                return true;
        } else {
            return customizations.preventAutoNumberEntry(page, currentState, nextState);
        }
    }
});

page.getReady(function() {

    // Count down timer
    var timerD = "true",
        mins = 1,
        secs = mins * 60,
        currentSeconds = 0,
        currentMinutes = 0;
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

        }
    }

    // Singapore unified scripts
    prelude.map(function(tagName){
        prelude.each(function(element){
            operatorId = element.getAttribute("data-operator-id");    
            if (!!operatorId) {
                element.style.display = (operatorId == "290" && params.carrierId == "70692" || operatorId == "262" && params.carrierId != "70692") ? "" : "none";
            }
        }, document.getElementsByTagName(tagName));
    }, ["span", "div"]);

    // for starhub we have 2 click subscription
    if (params.carrierId == '70692') {
        prelude.each(function(element){
            utils.addClickListener(element, function(){
                page.setState({agreed: true})
                setTimeout(function(){
                    page.setState({showStates: true})
                    if (page.getState().selectedSubMethod == "DirectWAP")
                        page.switchState("double-confirmation");
                    else if (page.getState().selectedSubMethod == "WAPPIN")
                        page.switchState("number-entry");
                }, 1000);
            });
        }, document.getElementsByClassName("subscribe"));
    }

    // for singtel we have 3 clicks before subscribing
    if (params.carrierId != '70692') {
        var checkBtn = document.querySelector('.checkBtn'),
            startBtn = document.querySelector('.startBtn');
        function checkBtnAction() {
            checkBtn.classList.add('switch');
            setTimeout(function() {
                checkBtn.classList.add('accept');
                setTimeout(function() {
                    checkBtn.style.display = "none";
                    startBtn.style.display = "block";
                    setTimeout(function() {
                        startBtn.classList.remove('show');
                    }, 500);
                }, 500);
            }, 500)
        }
        checkBtn.addEventListener('touchstart', checkBtnAction);
        checkBtn.addEventListener('click', checkBtnAction);
    }

});
