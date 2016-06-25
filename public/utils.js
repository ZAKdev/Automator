function composeURL(url, json) {

    var q = urlParser.parseQuery(url);

    for (var p in json)
        q.SET(p, json[p]);

    return q.toString();

};

function debounce(func, wait, immediate) {

    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = new Date().getTime() - timestamp;

      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = new Date().getTime();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };

};

function each( obj, callback, args ) {

    var value,
        i = 0,
        length = obj.length,
        isArray = 'number' == typeof(obj.length);

    if ( args ) {
        if ( isArray ) {
            for ( ; i < length; i++ ) {
                value = callback.apply( obj[ i ], args );

                if ( value === false ) {
                    break;
                }
            }
        } else {
            for ( i in obj ) {
                value = callback.apply( obj[ i ], args );

                if ( value === false ) {
                    break;
                }
            }
        }

    // A special, fast, case for the most common use of each
    } 

    else {
        if ( isArray ) {
            for ( ; i < length; i++ ) {
                value = callback.call( obj[ i ], i, obj[ i ] );

                if ( value === false ) {
                    break;
                }
            }
        } else {
            for ( i in obj ) {
                value = callback.call( obj[ i ], i, obj[ i ] );

                if ( value === false ) {
                    break;
                }
            }
        }
    }

    return obj;

};

function extend(deep, target, source) {

    for(var p in source) {
        if(source.hasOwnProperty(p)) {
            var s = source[p];
            var typeofs = typeof s;
            if(['number', 'string', 'boolean', 'function'].some(function(t) { return t == typeofs; })) {
                target[p] = s;
            } else {
                target[p] = extend(deep, {}, s);
            }
        }

    }

    return target;

};

function focusOnInputField(inputField) {

   var inputField = document.getElementById(inputField.id);

   if (inputField != null && inputField.value.length != 0) {
       if (inputField.createTextRange) {
           var FieldRange = inputField.createTextRange();
           FieldRange.moveStart('character', inputField.value.length);
           FieldRange.collapse();
           FieldRange.select();
       } else if (inputField.selectionStart || inputField.selectionStart == '0') {
           var elemLen = inputField.value.length;
           inputField.selectionStart = elemLen;
           inputField.selectionEnd = elemLen;
           inputField.focus();
       }
   } 

   else
       inputField.focus();

};

function getCookies() {

    var object = {},
        cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        cookie = cookies[i];
        parts = cookie.split("=");
        object[parts[0].trim()] = parts[1];
    };

    return object;

};

function getJSONP(url, callback) {
    
    var head = document.getElementsByTagName("head")[0],
        script = document.createElement("script"),
        functionName = "_jsonp" + new Date().getTime();

    window[functionName] = function(data){
        if (!!window.console && !!window.console.log)
          window.console.log("response: " + JSON.stringify(data, null, 4));
        head.removeChild(script);       
        callback && callback(data);     
    };

    script.src = composeURL(url, {jsonp: functionName});
    head.appendChild(script);

};

function recursiveExtend() {

    var args = Array.prototype.slice.call(arguments);

    if (args.length == 1)
        return args[0];

    var o1 = args.shift(),
        o2 = args.shift();

    args.unshift(extend(true, o1, o2))

    return recursiveExtend.apply(this, args);

}

// jQuery.param
function param(a) {
    
    var prefix,
        s = [],
        add = function(key, value) {
            s[s.length] = encodeURIComponent( key ) + "=" + encodeURIComponent(value == null ? "" : value);
        },
        buildParams = function(prefix, obj) {

          var name;    

          // Serialize array item.
          if (typeof object === "object" && typeof object.length === "number") {

              for (var i = 0; i < obj.length; i++) {

                  v = obj[i];

                  // Treat each array item as a scalar.
                  if (/\[\]$/.test(prefix))
                      add(prefix, v);

                  // Item is non-scalar (array or object), encode its numeric index.
                  else
                      buildParams(prefix + "[" + (typeof v === "object" ? i : "") + "]", v, add);
              }
              
          } 

          // Serialize object item.
          else if (typeof obj === "object") {        
              for ( name in obj )
                  buildParams(prefix + "[" + name + "]", obj[name], add);
          } 

          // Serialize scalar item.
          else
              add(prefix, obj);

      };

    for (prefix in a)
        buildParams(prefix, a[prefix])

    return s.join("&").replace(/%20/g, "+");

};






