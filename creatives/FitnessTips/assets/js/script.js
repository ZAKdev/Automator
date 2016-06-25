
/* Store Image */

window.addEventListener('load', function() {

    var store = document.getElementById('store');

    if(!store) return;
    if(navigator.userAgent.indexOf('Android') > -1) {
        store.src = "/public/img/store/store-google@2x.png"
    } else {
        store.src = "/public/img/store/store-apple@2x.png"
    }

});