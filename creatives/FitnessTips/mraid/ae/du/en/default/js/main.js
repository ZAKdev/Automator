var page = new commonMraidLandingPage({
    campaignId: window.mobiOneConstants.campaignId,
    creative: "FitnessTips",
    suffix: "mraid-ae-du-en-default",
    domain: "wap.mozook.com",
    language: "english",
    pageId: "2019",
    queryParams: window.mobiOneConstants.queryParams,
    doubleConfirmation: function(operatorId){      
      return false;
    },
    onWillTransition: function(currentState, nextState){
        if (currentState.name == "default-state" && nextState.name == "double-confirmation"){
            setTimeout(function(){
                acceptBtn.classList.add('switch');
                setTimeout(function(){
                    acceptBtn.classList.add('accept');
                },475);
            },1);
        }
        return true;
        /* return customizations.preventAutoNumberEntry(page, currentState, nextState, function(e) {
            return {selectedLanguage: prelude.find(function(element){ return element.tagName == "INPUT" && element.checked })(document.getElementsByName("language")).value};
        }); */
    },
    path: "uae/mobi-one/apis/jsonp"
});

page.getReady(function() {

    var confirmBtn = document.querySelector('.confirmBtn'),
        confirmBtnBlock = document.getElementById('confirmedBtnBlock'),
        confirmedBtn = document.querySelector('.confirmedBtn'),
        confirmError = document.querySelector('.confirmError');

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
        setTimeout(function(){
            confirmBtn.classList.add('accept');
        },475);
        event.preventDefault();
        return false;
    }

    function confirmedBtnAction(){
        if(confirmedBtn.classList.contains('default')) {
            confirmError.style.display="block";
            setTimeout(function(){
                confirmError.style.display="none";
            },3000);
        }
    }

});




