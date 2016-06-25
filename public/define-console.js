if(typeof console == 'undefined' || typeof console.log != 'function' || typeof console.error != 'function' || typeof console.warn != 'function') {
    var noop = function() { };
    try {
        window.console = {
            log: noop,
            error: noop,
            warn: noop
        };
    } catch (ex) {
    }
}